export function getRecommendations(id: number) {
    switch (id) {
        case 200:
        case 201:
        case 202:
        case 210:
        case 211:
        case 212:
        case 221:
        case 230:
        case 231:
        case 232:
            return 'Mach am besten drinnen Training, da es draussen gewittert.';
        case 300:
        case 301:
        case 302:
        case 310:
        case 311:
        case 312:
        case 313:
        case 314:
        case 321:
        case 500:
        case 501:
        case 520:
            return 'Falls es okay für dich ist, nass zu werden, kannst du draussen trainieren. Ziehe aber am besten eine Regenjacke oder ähnliches an.';
        case 502:
        case 503:
        case 504:
        case 511:
        case 521:
        case 522:
        case 531:
            return 'Es regnet draussen stark. Bleib am besten unter einem Dach, während du trainierst.';
        case 600:
        case 601:
            return 'Zieh dich warm an, falls du nach draussen gehst. Es schneit.';
        case 602:
            return 'Es wird empfohlen, drinnen zu bleiben, da es momentan stark schneit.';
        case 611:
        case 612:
        case 613:
        case 615:
        case 616:
        case 620:
        case 621:
            return 'Das Wetter ist nicht gerade schön, jedoch könntest du mit einer Regenjacke oder ähnlichem trotzdem draussen trainieren.';
        case 622:
            return 'Du solltest jetzt von zu Hause aus trainieren, da es einen schweren Schnee Regen hat.';
        case 701:
        case 711:
        case 721:
        case 741:
            return 'Du kannst gerne nach draussen gehen, aber es ist teilweise benebelt. Wir empfehlen dir, eine Warnweste zu tragen.';
        case 731:
        case 751:
        case 761:
            return 'Es fliegt Sand durch die Luft. Trag bei Möglichkeit einen Augenschutz';
        case 762:
        case 771:
        case 781:
            return 'ALARMMMMMMMMM!!! GEH IN EINEN BUNKER';
        case 800:
            return 'Geh draussen trainieren. Es ist wunderschön. Versuche aber genug zu trinken dabei zu haben, da es warm werden könnte. (evtl. Sonnencreme)';
        case 801:
        case 802:
        case 803:
        case 804:
            return 'Du kannst nach draussen gehen. Es ist momentan nur bewölkt.';
        default:
            return 'ALARMMMMMMMMM!!! KEIN BEKANNTES WETTER VORHANDEN. KÖNNTE ALLES SEIN!!!!!!!!!!';
    }
}