"""
Prepara le foto dei lavori per il sito.

Per ogni foto: raddrizza secondo l'EXIF, toglie i dati del cliente, rimpicciolisce
e ricomprime. I metadati non vengono ricopiati: nel salvataggio Pillow riparte da
zero, quindi restano fuori anche modello del telefono, data dello scatto e
posizione (in queste non c'era, ma vale come regola).

Gli originali stanno in `foto-originali/` e non sono nel repository: pesano
decine di megabyte e contengono i dati che qui vengono tolti. Questo file resta
per due motivi: dice cosa e' stato coperto e perche', e permette di rifare le
stesse foto se un domani servono di misura diversa.

    pip install Pillow && python3 scripts/foto.py
"""

from PIL import Image, ImageDraw, ImageFilter, ImageOps

SORGENTE = 'foto-originali/'
DESTINAZIONE = 'public/foto/'

# Lato lungo in pixel: sopra questa misura non si guadagna nulla a schermo e si
# pagano solo secondi di attesa. Due misure, una per le anteprime della griglia
# e una per l'immagine aperta a schermo intero.
GRANDE, PICCOLA = 1400, 700

FOTO = [
    # (nome finale, file, ritaglio in frazioni (sx,su,dx,giu) o None, aree da sfocare)
    ('batteria-iphone-originale', '26b123d3-6D68BE6C17C645C192A1D6BE9DB80444.jpeg', None, []),
    ('samsung-aperto', 'f6e52644-IMG_0110.jpeg', None, []),
    ('iphone-vetro-rotto', 'b2567815-IMG_0018.jpeg', None, []),
    # Ritagliata via la scocca posteriore, che portava l'etichetta con IMEI,
    # IMEI2 e numero di serie; sfocata anche la targhetta rimasta sul telaio,
    # che ripete l'IMEI in piccolo. Sono coordinate sull'immagine gia' ritagliata.
    ('xiaomi-batteria', 'f007283e-IMG_9969.jpeg', (0.06, 0.01, 0.74, 0.99),
     [(0.63, 0.855, 0.97, 0.945)]),
    ('switch-poe', '67ec6954-131DC16590B9495F975A695F6B5B082C.jpeg', None, []),
    # Sfocata l'etichetta della telecamera: il QR di molte telecamere IP contiene
    # il codice con cui si aggiunge il dispositivo all'app.
    ('telecamera-esterno', '166272e2-48495be3935a432f982628eee7916939.jpeg', None,
     [(0.28, 0.34, 0.45, 0.64)]),
    ('amplificatore-antenna', '3f0d0f9c-IMG_4273.jpeg', None, []),
    ('quadro-impianto', 'd7bbe8ee-IMG_0012.jpeg', None, []),
]


def sfoca(im, aree):
    """
    Sfocatura forte e irreversibile: non un mosaico, che a volte si ricostruisce.

    I bordi sono sfumati. Con il taglio netto si vedeva il rettangolo, e una
    toppa squadrata su una foto grida «qui c'era qualcosa» piu' di quanto non
    lo dicesse l'etichetta.
    """
    w, h = im.size
    for sx, su, dx, giu in aree:
        bersaglio = (int(sx * w), int(su * h), int(dx * w), int(giu * h))
        margine = max(6, min(bersaglio[2] - bersaglio[0], bersaglio[3] - bersaglio[1]) // 4)

        # Si lavora su un riquadro piu' largo del bersaglio: la sfumatura consuma
        # il margine, e sopra al bersaglio la copertura resta piena. Sfumando
        # verso l'interno il centro tornava trasparente e il codice si rileggeva.
        largo = (max(0, bersaglio[0] - margine), max(0, bersaglio[1] - margine),
                 min(w, bersaglio[2] + margine), min(h, bersaglio[3] + margine))
        pezzo = im.crop(largo)

        maschera = Image.new('L', pezzo.size, 0)
        ImageDraw.Draw(maschera).rectangle(
            (bersaglio[0] - largo[0], bersaglio[1] - largo[1],
             bersaglio[2] - largo[0], bersaglio[3] - largo[1]),
            fill=255,
        )
        maschera = maschera.filter(ImageFilter.GaussianBlur(margine / 2))

        im.paste(pezzo.filter(ImageFilter.GaussianBlur(max(8, min(pezzo.size) // 3))), largo, maschera)
    return im


totale = 0
for nome, file, ritaglio, aree in FOTO:
    im = ImageOps.exif_transpose(Image.open(SORGENTE + file)).convert('RGB')
    if ritaglio:
        w, h = im.size
        im = im.crop((int(ritaglio[0] * w), int(ritaglio[1] * h),
                      int(ritaglio[2] * w), int(ritaglio[3] * h)))
    im = sfoca(im, aree)

    for suffisso, lato in (('', GRANDE), ('-p', PICCOLA)):
        copia = im.copy()
        copia.thumbnail((lato, lato), Image.LANCZOS)
        percorso = f'{DESTINAZIONE}{nome}{suffisso}.jpg'
        copia.save(percorso, 'JPEG', quality=78, optimize=True, progressive=True)
        import os
        peso = os.path.getsize(percorso)
        totale += peso
        print(f'{nome}{suffisso:2} {copia.size[0]}x{copia.size[1]:5} {peso // 1024:5} kB')

print(f'\ntotale {totale // 1024} kB')
