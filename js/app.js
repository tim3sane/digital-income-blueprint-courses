/* ============================================
   THE BAR BOOK - Application Logic
   Cocktail data, rendering, and interactivity
   ============================================ */

// ============ COCKTAIL DATABASE ============
const cocktails = [
    {
        name: "Old Fashioned",
        year: "c. 1880",
        creator: "Pendennis Club",
        origin: "Louisville, Kentucky, EE.UU.",
        category: "unforgettable",
        spirit: "whiskey",
        glass: "Rocks / Old Fashioned",
        emoji: "🥃",
        image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&h=400&fit=crop&q=80",
        gradient: "linear-gradient(135deg, #8B4513 0%, #D2691E 100%)",
        history: "Considerado por muchos como el primer cóctel verdadero de la historia. Nació en el Pendennis Club de Louisville, Kentucky, alrededor de 1880. Un coronel habitual del club pidió a su bartender que le preparara algo simple pero sofisticado. La receta viajó al Waldorf-Astoria Hotel de Nueva York, donde se hizo famosa. Su nombre proviene de los clientes que pedían un cóctel hecho 'a la vieja usanza' (old fashioned way), rechazando las elaboraciones modernas de la época.",
        ingredients: [
            "4.5 cl Bourbon o Rye whiskey",
            "2 dashes Angostura bitters",
            "1 terrón de azúcar",
            "Unas gotas de agua"
        ],
        method: "Colocar el terrón de azúcar en un vaso rocks. Agregar los bitters y unas gotas de agua. Macerar hasta disolver el azúcar. Añadir un cubo grande de hielo y el whiskey. Revolver suavemente 20-30 segundos para integrar y enfriar.",
        garnish: "Twist de naranja expresado y cereza Luxardo"
    },
    {
        name: "Negroni",
        year: "1919",
        creator: "Conde Camillo Negroni",
        origin: "Florencia, Italia",
        category: "unforgettable",
        spirit: "gin",
        glass: "Rocks / Old Fashioned",
        emoji: "🍹",
        gradient: "linear-gradient(135deg, #8B0000 0%, #FF4500 100%)",
        history: "En 1919, el Conde Camillo Negroni frecuentaba el Caffè Casoni en Florencia, donde su bartender habitual, Fosco Scarselli, le preparaba Americanos. Un día, el Conde pidió algo más fuerte y Scarselli reemplazó la soda por gin, creando accidentalmente una de las bebidas más icónicas de la historia. La familia Negroni incluso fundó una destilería para producir un Negroni ready-to-drink.",
        ingredients: [
            "3 cl Gin",
            "3 cl Vermut rojo dulce",
            "3 cl Campari"
        ],
        method: "Verter todos los ingredientes directamente en un vaso rocks con hielo. Revolver suavemente durante 20-30 segundos. La proporción perfecta 1:1:1 es sagrada.",
        garnish: "Rodaja de naranja o twist de naranja"
    },
    {
        name: "Dry Martini",
        year: "c. 1880s",
        creator: "Orígenes disputados",
        origin: "Nueva York / San Francisco, EE.UU.",
        category: "unforgettable",
        spirit: "gin",
        glass: "Martini / Cocktail",
        emoji: "🍸",
        gradient: "linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 50%, #A0A0A0 100%)",
        history: "El origen del Martini es uno de los debates más antiguos de la coctelería. Algunas fuentes lo atribuyen a Jerry Thomas en San Francisco (1860s), otras al Knickerbocker Hotel de Nueva York (1880s). Lo cierto es que evolucionó del Martinez, haciéndose cada vez más seco con el tiempo. Churchill decía que bastaba con mirar la botella de vermut desde el otro lado de la habitación. James Bond lo popularizó 'agitado, no revuelto', aunque los puristas insisten en revolverlo.",
        ingredients: [
            "6 cl Gin London Dry",
            "1 cl Vermut seco"
        ],
        method: "Enfriar la copa martini. Verter gin y vermut en mixing glass con hielo. Revolver suavemente 30-40 segundos hasta alcanzar la dilución y temperatura perfectas. Colar en la copa fría. La proporción gin/vermut es personal: de 2:1 (wet) hasta 15:1 (bone dry).",
        garnish: "Aceituna verde o twist de limón"
    },
    {
        name: "Manhattan",
        year: "c. 1870s",
        creator: "Manhattan Club",
        origin: "Nueva York, EE.UU.",
        category: "unforgettable",
        spirit: "whiskey",
        glass: "Coupe / Cocktail",
        emoji: "🍸",
        gradient: "linear-gradient(135deg, #722F37 0%, #B22222 100%)",
        history: "Según la leyenda, fue creado en el Manhattan Club de Nueva York en los años 1870, para un banquete organizado por Lady Randolph Churchill (madre de Winston Churchill). Aunque esta historia es disputada por los historiadores, el Manhattan Club sí fue cuna de la coctelería elegante. Es la base sobre la cual se construyeron docenas de variaciones clásicas como el Rob Roy y el Boulevardier.",
        ingredients: [
            "5 cl Rye whiskey",
            "2 cl Vermut rojo dulce",
            "1 dash Angostura bitters"
        ],
        method: "Verter todos los ingredientes en un mixing glass con hielo. Revolver suavemente durante 30 segundos. Colar en copa coupe previamente enfriada.",
        garnish: "Cereza Maraschino (Luxardo)"
    },
    {
        name: "Daiquiri",
        year: "1898",
        creator: "Jennings Cox",
        origin: "Santiago de Cuba, Cuba",
        category: "unforgettable",
        spirit: "rum",
        glass: "Coupe",
        emoji: "🍸",
        gradient: "linear-gradient(135deg, #F0E68C 0%, #FFFACD 100%)",
        history: "Creado en 1898 por Jennings Cox, un ingeniero minero estadounidense que trabajaba cerca de la playa Daiquirí en Santiago de Cuba. Durante una reunión con colegas, se acabó el gin y Cox improvisó con ron local, zumo de limón y azúcar. El almirante Lucius W. Johnson llevó la receta al Army and Navy Club en Washington D.C., desde donde se expandió al mundo. Hemingway lo hizo famoso en el Floridita de La Habana.",
        ingredients: [
            "4.5 cl Ron blanco",
            "2.5 cl Zumo de lima fresco",
            "1.5 cl Jarabe simple"
        ],
        method: "Verter todos los ingredientes en la coctelera con hielo. Agitar vigorosamente 10-12 segundos. Doble colado en copa coupe fría. La simplicidad es su virtud: el balance ácido-dulce debe ser perfecto.",
        garnish: "Rueda de lima (opcional, muchos lo sirven sin garnish)"
    },
    {
        name: "Margarita",
        year: "1948",
        creator: "Carlos 'Danny' Herrera / Margarita Sames",
        origin: "México",
        category: "contemporary",
        spirit: "tequila",
        glass: "Coupe o Margarita",
        emoji: "🍹",
        gradient: "linear-gradient(135deg, #32CD32 0%, #ADFF2F 100%)",
        history: "El origen es disputado entre varias historias. La más aceptada atribuye la creación a Carlos 'Danny' Herrera en su restaurante Rancho La Gloria en Tijuana (1938-1948), preparada para una clienta que solo podía beber tequila. Otra versión la atribuye a Margarita Sames en una fiesta en Acapulco en 1948. El borde de sal se convirtió en su firma icónica, complementando la acidez del limón y el carácter del tequila.",
        ingredients: [
            "5 cl Tequila 100% agave",
            "3 cl Cointreau o triple sec",
            "2 cl Zumo de lima fresco"
        ],
        method: "Frotar el borde de la copa con lima y pasar por sal (media luna, no completa). Agitar todos los ingredientes con hielo vigorosamente. Doble colado en copa fría o sobre hielo fresco en vaso rocks.",
        garnish: "Borde de sal y rodaja o cuña de lima"
    },
    {
        name: "Mojito",
        year: "c. 1930s",
        creator: "Tradición cubana",
        origin: "La Habana, Cuba",
        category: "contemporary",
        spirit: "rum",
        glass: "Collins / Highball",
        emoji: "🍹",
        gradient: "linear-gradient(135deg, #00FA9A 0%, #98FB98 100%)",
        history: "Sus raíces se remontan al siglo XVI con una bebida medicinal llamada 'El Draque', en honor al corsario Sir Francis Drake. La versión moderna nació en los bares de La Habana en los años 1930, popularizándose en La Bodeguita del Medio, donde un letrero atribuido a Hemingway dice: 'Mi mojito en La Bodeguita, mi daiquirí en El Floridita'. Es el cóctel que mejor captura el espíritu tropical de Cuba.",
        ingredients: [
            "4 cl Ron blanco cubano",
            "3 cl Zumo de lima fresco",
            "6 hojas de menta fresca",
            "2 cl Jarabe simple",
            "Soda / agua con gas"
        ],
        method: "Colocar la menta y el jarabe en el vaso. Macerar MUY suavemente (no triturar, solo presionar para liberar los aceites). Añadir el zumo de lima y el ron. Llenar con hielo picado y completar con soda. Revolver de abajo hacia arriba para integrar.",
        garnish: "Ramita de menta fresca y rodaja de lima"
    },
    {
        name: "Whiskey Sour",
        year: "1862",
        creator: "Jerry Thomas",
        origin: "Nueva York, EE.UU.",
        category: "unforgettable",
        spirit: "whiskey",
        glass: "Rocks / Old Fashioned",
        emoji: "🥃",
        gradient: "linear-gradient(135deg, #DAA520 0%, #FFD700 100%)",
        history: "Publicado por primera vez en 1862 por Jerry Thomas en 'The Bartender's Guide', el primer libro de coctelería de la historia. La categoría 'sour' — base espirituosa, cítrico y endulzante — es uno de los pilares fundamentales de la coctelería. La adición de clara de huevo, que crea la espuma sedosa característica, fue una innovación posterior que elevó el cóctel a otro nivel de sofisticación.",
        ingredients: [
            "4.5 cl Bourbon",
            "3 cl Zumo de limón fresco",
            "1.5 cl Jarabe simple",
            "1 clara de huevo (opcional)"
        ],
        method: "Si usas clara de huevo: dry shake primero (sin hielo) 15 segundos para emulsionar. Agregar hielo y agitar vigorosamente otros 15 segundos. Doble colado en vaso rocks con hielo fresco o copa coupe.",
        garnish: "Cereza Maraschino y media rodaja de naranja. Opcionalmente, unas gotas de Angostura sobre la espuma"
    },
    {
        name: "Cosmopolitan",
        year: "1987",
        creator: "Toby Cecchini",
        origin: "Nueva York, EE.UU.",
        category: "contemporary",
        spirit: "vodka",
        glass: "Martini / Cocktail",
        emoji: "🍸",
        gradient: "linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)",
        history: "Aunque varias personas reclaman su invención, la versión moderna se atribuye a Toby Cecchini, quien en 1987 en The Odeon de Nueva York refinó una receta que circulaba en bares de San Francisco. Fue la serie 'Sex and the City' la que catapultó el Cosmopolitan a la fama mundial en los años 90, convirtiéndolo en el cóctel más pedido de la década y símbolo de la sofisticación urbana.",
        ingredients: [
            "4 cl Vodka cítrico",
            "1.5 cl Cointreau",
            "1.5 cl Zumo de lima fresco",
            "3 cl Zumo de arándano (cranberry)"
        ],
        method: "Agitar todos los ingredientes vigorosamente con hielo. Doble colado en copa martini previamente enfriada. El color rosa pálido debe ser elegante, no estridente.",
        garnish: "Twist de naranja flameado o rueda de lima"
    },
    {
        name: "Mai Tai",
        year: "1944",
        creator: "Victor 'Trader Vic' Bergeron",
        origin: "Oakland, California, EE.UU.",
        category: "contemporary",
        spirit: "rum",
        glass: "Rocks / Old Fashioned",
        emoji: "🍹",
        gradient: "linear-gradient(135deg, #FF8C00 0%, #FF6347 100%)",
        history: "Creado en 1944 por Victor Bergeron (Trader Vic) en su restaurante de Oakland, California. Al probarlo, una amiga tahitiana exclamó '¡Mai tai roa ae!' ('¡Fuera de este mundo!' en tahitiano), dándole nombre al cóctel. Don the Beachcomber también reclama la autoría con una versión de 1933. La versión de Trader Vic, más simple y elegante, es la reconocida por la IBA. Es la piedra angular de la coctelería Tiki.",
        ingredients: [
            "3 cl Ron añejo jamaicano",
            "3 cl Ron añejo martiniqués",
            "1.5 cl Curaçao de naranja",
            "1.5 cl Orgeat (jarabe de almendras)",
            "1 cl Zumo de lima fresco"
        ],
        method: "Agitar todos los ingredientes vigorosamente con hielo. Servir en vaso rocks lleno de hielo picado. El ron debe ser protagonista; los modificadores lo complementan, no lo enmascaran.",
        garnish: "Media lima gastada, ramita de menta fresca y flor comestible"
    },
    {
        name: "Piña Colada",
        year: "1954",
        creator: "Ramón 'Monchito' Marrero",
        origin: "San Juan, Puerto Rico",
        category: "contemporary",
        spirit: "rum",
        glass: "Hurricane o Poco Grande",
        emoji: "🍹",
        gradient: "linear-gradient(135deg, #FFFDD0 0%, #FFE4B5 100%)",
        history: "Creada en 1954 por Ramón 'Monchito' Marrero en el Caribe Hilton de San Juan, Puerto Rico, después de tres meses perfeccionando la receta. En 1978 fue declarada la bebida oficial de Puerto Rico. La canción 'Escape' de Rupert Holmes (1979), conocida como 'la canción de la Piña Colada', cimentó su lugar en la cultura popular mundial. El nombre significa 'piña colada' (colar la piña).",
        ingredients: [
            "5 cl Ron blanco",
            "3 cl Crema de coco",
            "5 cl Zumo de piña"
        ],
        method: "Mezclar todos los ingredientes con hielo en licuadora hasta obtener textura suave y cremosa. También puede prepararse agitada con hielo para una versión más limpia. Servir en copa hurricane.",
        garnish: "Cuña de piña y cereza Maraschino"
    },
    {
        name: "Moscow Mule",
        year: "1941",
        creator: "John G. Martin, Jack Morgan y Rudolph Kunett",
        origin: "Nueva York, EE.UU.",
        category: "contemporary",
        spirit: "vodka",
        glass: "Taza de cobre (Moscow Mule mug)",
        emoji: "🫙",
        gradient: "linear-gradient(135deg, #B87333 0%, #CD853F 100%)",
        history: "Nació en 1941 de la colaboración entre John G. Martin (distribuidor de vodka Smirnoff), Jack Morgan (dueño del Cock 'n' Bull en Hollywood, con exceso de ginger beer) y Rudolph Kunett (también involucrado con Smirnoff). La taza de cobre fue idea de una amiga que fabricaba tazas. El marketing fue revolucionario: fotografiaban a bartenders con la taza, creando una de las primeras campañas virales pre-internet. Fue clave para popularizar el vodka en Estados Unidos.",
        ingredients: [
            "4.5 cl Vodka",
            "12 cl Ginger beer",
            "1 cl Zumo de lima fresco"
        ],
        method: "Construir directamente en la taza de cobre. Agregar vodka y zumo de lima sobre hielo. Completar con ginger beer fría. Revolver suavemente. El cobre mantiene la bebida extra fría.",
        garnish: "Rodaja de lima y ramita de menta (opcional)"
    },
    {
        name: "Espresso Martini",
        year: "1983",
        creator: "Dick Bradsell",
        origin: "Londres, Inglaterra",
        category: "newera",
        spirit: "vodka",
        glass: "Martini / Cocktail",
        emoji: "☕",
        gradient: "linear-gradient(135deg, #3C1518 0%, #69140E 100%)",
        history: "Creado en 1983 por Dick Bradsell en Fred's Club de Londres. La leyenda dice que una joven modelo (se rumora que era Kate Moss, aunque Bradsell nunca confirmó) se acercó a la barra y pidió algo que la 'despierte y luego la emborrache'. Bradsell combinó vodka, espresso fresco, licor de café y jarabe simple, creando un cóctel que se convertiría en un fenómeno global. Originalmente lo llamó 'Vodka Espresso', luego 'Pharmaceutical Stimulant'.",
        ingredients: [
            "5 cl Vodka",
            "1 cl Licor de café (Kahlúa)",
            "1 shot de espresso fresco (fuerte y caliente)",
            "1 cl Jarabe simple"
        ],
        method: "Preparar el espresso y dejarlo enfriar ligeramente. Agitar TODOS los ingredientes muy vigorosamente con hielo durante 15 segundos. La agitación intensa es crucial para crear la crema (espuma) característica. Doble colado en copa martini fría.",
        garnish: "Tres granos de café sobre la espuma (representan salud, riqueza y felicidad)"
    },
    {
        name: "Aperol Spritz",
        year: "c. 1950s",
        creator: "Tradición veneciana",
        origin: "Venecia / Padua, Italia",
        category: "contemporary",
        spirit: "other",
        glass: "Copa de vino grande",
        emoji: "🥂",
        gradient: "linear-gradient(135deg, #FF6B35 0%, #FF9F1C 100%)",
        history: "El 'spritz' nació cuando soldados austriacos en el Véneto del siglo XIX pedían que les 'rociaran' (spritzen en alemán) agua con gas en el vino local, que encontraban demasiado fuerte. En los años 1950, los italianos reemplazaron el agua por Aperol (creado en 1919 por los hermanos Barbieri) y Prosecco. El Aperol Spritz se mantuvo como fenómeno regional hasta que una campaña de marketing global en los 2000s lo convirtió en sinónimo de aperitivo europeo.",
        ingredients: [
            "9 cl Prosecco",
            "6 cl Aperol",
            "Splash de soda"
        ],
        method: "Construir directamente en copa de vino grande con hielo abundante. Primero el Prosecco, luego el Aperol, finalmente un splash de soda. La proporción clásica es 3:2:1. Revolver muy suavemente para no perder la carbonatación.",
        garnish: "Rodaja de naranja"
    },
    {
        name: "Sidecar",
        year: "c. 1920s",
        creator: "Atribuido a Harry MacElhone o Pat MacGarry",
        origin: "París, Francia",
        category: "unforgettable",
        spirit: "brandy",
        glass: "Coupe / Cocktail",
        emoji: "🍸",
        gradient: "linear-gradient(135deg, #D4A574 0%, #C68E17 100%)",
        history: "Creado durante los años 1920 en París, con dos bares reclamando la paternidad: Harry's New York Bar (Harry MacElhone) y The Ritz Paris (Frank Meier). Según la historia, fue nombrado en honor a un capitán del ejército que llegaba al bar en el sidecar de una motocicleta. El Sidecar es la base de toda la familia 'sour con espíritu oscuro', y su estructura (base + cítrico + licor de naranja) es un template maestro de la coctelería.",
        ingredients: [
            "5 cl Cognac",
            "2 cl Cointreau",
            "2 cl Zumo de limón fresco"
        ],
        method: "Agitar todos los ingredientes vigorosamente con hielo. Doble colado en copa coupe fría. Opcionalmente, borde de azúcar en media copa. El balance entre el brandy, la acidez y el dulzor del Cointreau debe ser exacto.",
        garnish: "Twist de naranja (borde de azúcar opcional)"
    },
    {
        name: "Aviation",
        year: "1916",
        creator: "Hugo Ensslin",
        origin: "Nueva York, EE.UU.",
        category: "unforgettable",
        spirit: "gin",
        glass: "Cocktail / Coupe",
        emoji: "✈️",
        gradient: "linear-gradient(135deg, #B0C4DE 0%, #E6E6FA 100%)",
        history: "Creado en 1916 por Hugo Ensslin, jefe de bar del Hotel Wallick en Nueva York, y publicado en su libro 'Recipes for Mixed Drinks'. Su ingrediente secreto, el licor de violeta crème de violette, le da un color azul cielo que evoca la aviación. Cuando este licor desapareció del mercado, el cóctel cayó en el olvido por décadas. Fue redescubierto por la comunidad de coctelería craft en los 2000s cuando el crème de violette volvió a estar disponible.",
        ingredients: [
            "4.5 cl Gin",
            "1.5 cl Maraschino liqueur",
            "1.5 cl Zumo de limón fresco",
            "1 barspoon Crème de violette"
        ],
        method: "Agitar todos los ingredientes con hielo. Doble colado en copa cocktail fría. La crème de violette debe usarse con moderación — es un toque sutil, no el protagonista. El color debe ser lavanda pálido, no morado intenso.",
        garnish: "Cereza Maraschino"
    },
    {
        name: "Sazerac",
        year: "c. 1850s",
        creator: "Antoine Amédée Peychaud",
        origin: "Nueva Orleans, Louisiana, EE.UU.",
        category: "unforgettable",
        spirit: "whiskey",
        glass: "Rocks / Old Fashioned",
        emoji: "🥃",
        gradient: "linear-gradient(135deg, #654321 0%, #8B7355 100%)",
        history: "El Sazerac es el cóctel oficial de Nueva Orleans, con raíces que se remontan a los años 1850. Originalmente hecho con cognac Sazerac de Forge et Fils en la Sazerac Coffee House. Antoine Amédée Peychaud, un farmacéutico criollo, servía su brandy con sus propios bitters como tónico medicinal. Cuando la filoxera devastó los viñedos franceses, el cognac fue reemplazado por rye whiskey. El rinse de absenta le da su carácter distintivo.",
        ingredients: [
            "5 cl Rye whiskey (o Cognac)",
            "1 cl Jarabe simple",
            "2 dashes Peychaud's bitters",
            "Absenta (para rinse del vaso)"
        ],
        method: "Enfriar un vaso rocks con hielo. En otro vaso, macerar el azúcar con los bitters. Añadir el whiskey y hielo, revolver. Descartar el hielo del vaso frío, hacer rinse con absenta (cubrir las paredes y descartar el exceso). Colar la mezcla en el vaso preparado. SIN hielo en el servicio final.",
        garnish: "Twist de limón expresado (sobre el cóctel, no dentro)"
    },
    {
        name: "Tom Collins",
        year: "1876",
        creator: "Jerry Thomas",
        origin: "Nueva York / Londres",
        category: "unforgettable",
        spirit: "gin",
        glass: "Collins",
        emoji: "🥛",
        gradient: "linear-gradient(135deg, #F0FFF0 0%, #FFFAF0 100%)",
        history: "Publicado por Jerry Thomas en su edición de 1876 de 'The Bartender's Guide'. Curiosamente, su popularización se debió a una broma viral de 1874 conocida como 'The Great Tom Collins Hoax', donde la gente les decía a otros que un tal 'Tom Collins' estaba hablando mal de ellos en un bar cercano, enviándolos en una búsqueda inútil. Los bartenders empezaron a crear la bebida para los confundidos buscadores. El nombre también deriva del gin Old Tom que se usaba originalmente.",
        ingredients: [
            "4.5 cl Gin Old Tom (o London Dry)",
            "3 cl Zumo de limón fresco",
            "1.5 cl Jarabe simple",
            "Soda / agua con gas"
        ],
        method: "Agitar gin, zumo de limón y jarabe con hielo. Colar en vaso collins lleno de hielo fresco. Completar con soda fría. Revolver una sola vez suavemente para integrar sin perder la efervescencia.",
        garnish: "Rodaja de limón y cereza Maraschino"
    },
    {
        name: "Caipirinha",
        year: "c. 1918",
        creator: "Tradición brasileña",
        origin: "São Paulo, Brasil",
        category: "contemporary",
        spirit: "other",
        glass: "Rocks / Old Fashioned",
        emoji: "🍹",
        gradient: "linear-gradient(135deg, #ADFF2F 0%, #7FFF00 100%)",
        history: "La bebida nacional de Brasil nació como remedio casero contra la gripe española de 1918 en las regiones rurales de São Paulo, donde los agricultores mezclaban cachaça con limón, ajo y miel. Con el tiempo, el ajo y la miel fueron reemplazados por azúcar, creando la Caipirinha que conocemos. La cachaça, destilada de jugo de caña de azúcar fresco (a diferencia del ron, que usa melaza), le da su carácter único. Fue oficializada como patrimonio cultural brasileño.",
        ingredients: [
            "5 cl Cachaça",
            "1 lima cortada en gajos",
            "2 cucharaditas de azúcar blanca"
        ],
        method: "Cortar la lima en 8 gajos, retirar la médula central blanca. Colocar en el vaso con el azúcar. Macerar firmemente para extraer el jugo y los aceites. Agregar la cachaça y hielo picado. Revolver vigorosamente para integrar. NO se usa jarabe — el azúcar granulada es parte de la textura.",
        garnish: "Se sirve tal cual — la lima macerada es la decoración"
    },
    {
        name: "Bloody Mary",
        year: "1921",
        creator: "Fernand Petiot",
        origin: "París / Nueva York",
        category: "contemporary",
        spirit: "vodka",
        glass: "Highball / Collins",
        emoji: "🍹",
        gradient: "linear-gradient(135deg, #DC143C 0%, #8B0000 100%)",
        history: "La versión original fue creada por Fernand Petiot en 1921 en Harry's New York Bar de París, donde mezcló vodka con zumo de tomate. Al mudarse al King Cole Bar del St. Regis Hotel en Nueva York en 1934, Petiot perfeccionó la receta añadiendo los condimentos picantes y la complejidad que la definen hoy. Se especula que el nombre proviene de la reina María I de Inglaterra ('Bloody Mary') o de una clienta del bar. Es el cóctel dominical por excelencia.",
        ingredients: [
            "4.5 cl Vodka",
            "9 cl Zumo de tomate",
            "1.5 cl Zumo de limón fresco",
            "2-3 dashes Worcestershire",
            "2-3 dashes Tabasco",
            "Sal, pimienta, apio sal al gusto"
        ],
        method: "Técnica ROLL: Verter todos los ingredientes en un vaso con hielo. Pasar el contenido de un vaso a otro varias veces (rolling) para mezclar sin aireación excesiva. NO agitar — destruye la textura del tomate. Servir en vaso highball con hielo fresco.",
        garnish: "Tallo de apio, cuña de limón, aceitunas. Las versiones modernas pueden incluir bacon, langostinos y más"
    },
    {
        name: "Gimlet",
        year: "c. 1920s",
        creator: "Sir Thomas Gimlette (atribuido)",
        origin: "Marina Real Británica",
        category: "unforgettable",
        spirit: "gin",
        glass: "Coupe / Cocktail",
        emoji: "🍸",
        gradient: "linear-gradient(135deg, #90EE90 0%, #98FB98 100%)",
        history: "Nombrado supuestamente en honor al Cirujano Contraalmirante Sir Thomas Gimlette de la Marina Real Británica, quien mezclaba gin con zumo de lima como medida preventiva contra el escorbuto en los marineros. La receta original usaba Rose's Lime Juice Cordial (inventado en 1867 para preservar zumo de lima para la armada). La versión moderna con zumo fresco es preferida por bartenders craft, pero los puristas argumentan que sin cordial de lima no es un verdadero Gimlet.",
        ingredients: [
            "6 cl Gin",
            "1.5 cl Zumo de lima fresco",
            "1.5 cl Jarabe simple (o cordial de lima)"
        ],
        method: "Agitar todos los ingredientes con hielo. Doble colado en copa coupe fría. Algunos bartenders lo revuelven en lugar de agitarlo. La simplicidad exige ingredientes de primera calidad.",
        garnish: "Rueda de lima"
    },
    {
        name: "Mint Julep",
        year: "1803",
        creator: "Tradición sureña estadounidense",
        origin: "Sur de Estados Unidos",
        category: "contemporary",
        spirit: "whiskey",
        glass: "Vaso Julep (metal)",
        emoji: "🥤",
        gradient: "linear-gradient(135deg, #228B22 0%, #90EE90 100%)",
        history: "La primera receta publicada data de 1803, aunque su uso medicinal con brandy se remonta al siglo XVIII. Se convirtió en la bebida oficial del Kentucky Derby en 1938 y cada primer sábado de mayo se sirven casi 120,000 Juleps en Churchill Downs. La tradición dicta servirlo en un vaso de plata o peltre, que se escarcha con el frío creando una experiencia visual y táctil única. Es el cóctel del bourbon por excelencia.",
        ingredients: [
            "6 cl Bourbon",
            "1 cl Jarabe simple",
            "8-10 hojas de menta fresca"
        ],
        method: "Macerar suavemente la menta con el jarabe en el fondo del vaso julep. Llenar con hielo picado (crushed) hasta 3/4. Añadir bourbon. Remover brevemente. Agregar más hielo picado hasta formar un domo sobre el borde. La escarcha que se forma en el vaso de metal es parte de la experiencia.",
        garnish: "Generoso ramo de menta fresca, azúcar glas espolvoreado"
    },
    {
        name: "Singapore Sling",
        year: "1915",
        creator: "Ngiam Tong Boon",
        origin: "Singapur",
        category: "contemporary",
        spirit: "gin",
        glass: "Hurricane / Sling",
        emoji: "🍹",
        gradient: "linear-gradient(135deg, #FF69B4 0%, #FF6347 100%)",
        history: "Creado alrededor de 1915 por Ngiam Tong Boon en el Long Bar del Raffles Hotel en Singapur. Fue diseñado como un cóctel 'aceptable' para las mujeres de la época, quienes no debían ser vistas bebiendo alcohol en público — el color rosado lo hacía parecer un zumo de fruta. La receta original se perdió y fue reconstruida a partir de la memoria de antiguos bartenders del hotel. El Raffles Hotel sigue sirviendo la versión tradicional.",
        ingredients: [
            "3 cl Gin",
            "1.5 cl Cherry Heering",
            "0.75 cl Cointreau",
            "0.75 cl DOM Bénédictine",
            "1 cl Grenadina",
            "12 cl Zumo de piña",
            "1.5 cl Zumo de lima fresco",
            "1 dash Angostura bitters"
        ],
        method: "Agitar todos los ingredientes con hielo. Colar en vaso hurricane o sling lleno de hielo fresco. Es un cóctel complejo con muchos ingredientes — la clave es que ninguno domine sobre los demás.",
        garnish: "Rodaja de piña y cereza Maraschino"
    },
    {
        name: "Paloma",
        year: "c. 1950s",
        creator: "Don Javier Delgado Corona (atribuido)",
        origin: "Tequila, Jalisco, México",
        category: "contemporary",
        spirit: "tequila",
        glass: "Highball / Collins",
        emoji: "🍹",
        gradient: "linear-gradient(135deg, #FFB6C1 0%, #FFA07A 100%)",
        history: "Aunque la Margarita es el cóctel de tequila más conocido internacionalmente, la Paloma es la bebida de tequila más popular EN México. Se atribuye a Don Javier Delgado Corona de La Capilla, un legendario bar en Tequila, Jalisco, donde sirvió cócteles durante más de 60 años. El nombre 'Paloma' (paloma/dove) refleja su naturaleza refrescante y ligera. En México se prepara comúnmente con Squirt o Jarritos de toronja.",
        ingredients: [
            "5 cl Tequila blanco 100% agave",
            "10 cl Refresco de toronja (o zumo de pomelo + soda)",
            "1 cl Zumo de lima fresco",
            "Pizca de sal"
        ],
        method: "Pasar sal por el borde del vaso (opcional). Construir directamente: agregar tequila y zumo de lima sobre hielo. Completar con refresco de toronja. Revolver suavemente. Para la versión craft, usar zumo de pomelo fresco con soda y una pizca de jarabe simple.",
        garnish: "Gajo de toronja (pomelo) y borde de sal"
    },
    {
        name: "Americano",
        year: "1860s",
        creator: "Gaspare Campari",
        origin: "Milán, Italia",
        category: "unforgettable",
        spirit: "other",
        glass: "Rocks / Old Fashioned o Highball",
        emoji: "🥃",
        gradient: "linear-gradient(135deg, #B22222 0%, #FF6347 100%)",
        history: "Creado en los años 1860 por Gaspare Campari en su Caffè Camparino en la Galleria Vittorio Emanuele II de Milán. Originalmente llamado 'Milano-Torino' por sus ingredientes (Campari de Milán y vermut de Turín). Fue rebautizado 'Americano' por los turistas estadounidenses que lo adoptaron durante la Prohibición, cuando viajaban a Europa para poder beber legalmente. Es el padre directo del Negroni — la misma base con gin en lugar de soda.",
        ingredients: [
            "3 cl Campari",
            "3 cl Vermut rojo dulce",
            "Splash de soda / agua con gas"
        ],
        method: "Construir directamente en vaso rocks o highball con hielo. Verter Campari y vermut. Completar con un splash de soda. Revolver suavemente. Es un aperitivo, debe abrir el apetito.",
        garnish: "Rodaja de naranja"
    },
    {
        name: "Penicillin",
        year: "2005",
        creator: "Sam Ross",
        origin: "Nueva York, EE.UU.",
        category: "newera",
        spirit: "whiskey",
        glass: "Rocks / Old Fashioned",
        emoji: "💊",
        gradient: "linear-gradient(135deg, #DAA520 0%, #B8860B 100%)",
        history: "Creado en 2005 por Sam Ross en el legendario bar Milk & Honey de Nueva York. Es el cóctel moderno más exitoso del siglo XXI y ya fue incluido en la lista oficial de la IBA. Ross combinó scotch blended con miel, jengibre y limón, creando un whiskey sour con profundidad extra. El float de whisky ahumado Islay añade complejidad aromática. Su nombre hace referencia tanto al remedio contra el resfriado como al descubrimiento revolucionario.",
        ingredients: [
            "6 cl Blended Scotch whisky",
            "2.5 cl Zumo de limón fresco",
            "2 cl Jarabe de miel y jengibre",
            "0.75 cl Islay single malt Scotch (float)"
        ],
        method: "Agitar el scotch blended, zumo de limón y jarabe de miel-jengibre con hielo. Colar en vaso rocks con hielo fresco. Hacer un float de Islay scotch encima usando la parte trasera de una bar spoon. El jarabe de miel-jengibre se prepara con miel, jengibre fresco y agua.",
        garnish: "Jengibre confitado en un pick"
    },
    {
        name: "Last Word",
        year: "1916",
        creator: "Detroit Athletic Club",
        origin: "Detroit, Michigan, EE.UU.",
        category: "unforgettable",
        spirit: "gin",
        glass: "Coupe / Cocktail",
        emoji: "🍸",
        gradient: "linear-gradient(135deg, #6B8E23 0%, #556B2F 100%)",
        history: "Creado alrededor de 1916 en el Detroit Athletic Club y publicado en 'Bottoms Up' de Ted Saucier en 1951. El cóctel cayó en el olvido durante más de 50 años hasta que el bartender Murray Stenson lo redescubrió en 2004 en el Zig Zag Café de Seattle, consultando viejos libros de coctelería. Su resurrección fue uno de los momentos clave del renacimiento de la coctelería craft. La proporción exacta de partes iguales es su sello.",
        ingredients: [
            "2.25 cl Gin",
            "2.25 cl Green Chartreuse",
            "2.25 cl Maraschino liqueur",
            "2.25 cl Zumo de lima fresco"
        ],
        method: "Agitar todos los ingredientes vigorosamente con hielo. Doble colado en copa coupe fría. La proporción de partes iguales es SAGRADA — no la modifiques. La Chartreuse verde aporta complejidad herbal única.",
        garnish: "Sin guarnición (o cereza Maraschino opcional)"
    },
    {
        name: "Boulevardier",
        year: "1927",
        creator: "Erskine Gwynne",
        origin: "París, Francia",
        category: "unforgettable",
        spirit: "whiskey",
        glass: "Rocks / Old Fashioned o Coupe",
        emoji: "🥃",
        gradient: "linear-gradient(135deg, #800020 0%, #DC143C 100%)",
        history: "Creado en 1927 por Erskine Gwynne, un escritor y bon vivant estadounidense expatriado en París, quien publicaba una revista llamada 'Boulevardier'. La receta fue documentada por Harry MacElhone en 'Barflies and Cocktails' (1927). Es esencialmente un Negroni con bourbon o rye en lugar de gin, lo que le da más cuerpo y dulzor. Ha vivido un resurgimiento espectacular con el auge de la coctelería craft.",
        ingredients: [
            "4.5 cl Bourbon o Rye whiskey",
            "3 cl Campari",
            "3 cl Vermut rojo dulce"
        ],
        method: "Verter todos los ingredientes en mixing glass con hielo. Revolver 30 segundos. Colar en copa coupe fría o servir en rocks con hielo fresco. Las proporciones varían: algunos prefieren 1:1:1 como el Negroni, otros favorecen más whiskey.",
        garnish: "Twist de naranja"
    },
    {
        name: "Clover Club",
        year: "c. 1880s",
        creator: "The Clover Club, Philadelphia",
        origin: "Filadelfia, Pennsylvania, EE.UU.",
        category: "unforgettable",
        spirit: "gin",
        glass: "Coupe / Cocktail",
        emoji: "🍸",
        gradient: "linear-gradient(135deg, #DB7093 0%, #C71585 100%)",
        history: "Nombrado en honor al Clover Club, un grupo de caballeros que se reunía en el Hotel Bellevue-Stratford de Filadelfia desde la década de 1880. Sus miembros incluían abogados, escritores y líderes empresariales. El cóctel fue documentado en múltiples libros de coctelería pre-Prohibición. Fue considerado 'afeminado' durante décadas, lo que lo relegó al olvido. La coctelería craft del siglo XXI lo ha reivindicado como un clásico sofisticado y técnicamente exigente.",
        ingredients: [
            "4.5 cl Gin",
            "1.5 cl Zumo de limón fresco",
            "1.5 cl Jarabe de frambuesa",
            "1 clara de huevo"
        ],
        method: "Dry shake todos los ingredientes sin hielo primero (15 segundos) para emulsionar la clara. Agregar hielo y agitar vigorosamente otros 15 segundos. Doble colado en copa coupe fría. La espuma rosa debe ser densa y suave.",
        garnish: "Tres frambuesas frescas sobre la espuma"
    },
    {
        name: "French 75",
        year: "1915",
        creator: "Harry MacElhone (atribuido)",
        origin: "París, Francia",
        category: "contemporary",
        spirit: "gin",
        glass: "Flauta de champagne",
        emoji: "🥂",
        gradient: "linear-gradient(135deg, #FFD700 0%, #FFFACD 100%)",
        history: "Nombrado en honor al cañón de campaña francés Canon de 75 modèle 1897, famoso por su potencia y velocidad de disparo en la Primera Guerra Mundial. Fue creado alrededor de 1915 en Harry's New York Bar de París (aunque algunos lo atribuyen al barman Harry Craddock en The Savoy). La idea era que el cóctel tenía tal fuerza que era como ser golpeado por el cañón francés de 75mm. Originalmente se servía en un vaso collins con hielo.",
        ingredients: [
            "3 cl Gin",
            "1.5 cl Zumo de limón fresco",
            "1 cl Jarabe simple",
            "6 cl Champagne brut (o Prosecco)"
        ],
        method: "Agitar gin, zumo de limón y jarabe con hielo. Colar en flauta de champagne fría. Completar con champagne frío. NO revolver después de añadir el champagne — las burbujas integran naturalmente.",
        garnish: "Twist de limón largo"
    }
];

// ============ DOM ELEMENTS ============
const cocktailGrid = document.getElementById('cocktailGrid');
const cocktailSearch = document.getElementById('cocktailSearch');
const spiritFilters = document.getElementById('spiritFilters');
const categoryFilters = document.getElementById('categoryFilters');
const noResults = document.getElementById('noResults');
const cocktailModal = document.getElementById('cocktailModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const heroParticles = document.getElementById('heroParticles');

// ============ STATE ============
let activeSpirit = 'all';
let activeCategory = 'all';
let searchQuery = '';

// ============ RENDER COCKTAILS ============
function getCategoryLabel(category) {
    const labels = {
        unforgettable: 'The Unforgettables',
        contemporary: 'Contemporary Classics',
        newera: 'New Era Drinks'
    };
    return labels[category] || category;
}

function getSpiritLabel(spirit) {
    const labels = {
        whiskey: 'Whiskey',
        gin: 'Gin',
        rum: 'Ron',
        vodka: 'Vodka',
        tequila: 'Tequila',
        brandy: 'Brandy',
        other: 'Otro'
    };
    return labels[spirit] || spirit;
}

function filterCocktails() {
    return cocktails.filter(c => {
        const matchSpirit = activeSpirit === 'all' || c.spirit === activeSpirit;
        const matchCategory = activeCategory === 'all' || c.category === activeCategory;
        const matchSearch = searchQuery === '' ||
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.origin.toLowerCase().includes(searchQuery.toLowerCase());
        return matchSpirit && matchCategory && matchSearch;
    });
}

function renderCocktails() {
    const filtered = filterCocktails();
    cocktailGrid.innerHTML = '';

    if (filtered.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    filtered.forEach((cocktail, index) => {
        const card = document.createElement('div');
        card.className = 'cocktail-card';
        card.style.animationDelay = `${index * 0.05}s`;
        card.onclick = () => openModal(cocktail);

        card.innerHTML = `
            <div class="cocktail-card-image" style="background: ${cocktail.gradient}">
                <span>${cocktail.emoji}</span>
            </div>
            <div class="cocktail-card-body">
                <div class="cocktail-card-category">${getCategoryLabel(cocktail.category)}</div>
                <h3 class="cocktail-card-name">${cocktail.name}</h3>
                <div class="cocktail-card-meta">
                    <span>${cocktail.year}</span>
                    <span>·</span>
                    <span>${cocktail.origin.split(',')[0]}</span>
                </div>
                <p class="cocktail-card-desc">${cocktail.history.substring(0, 120)}...</p>
            </div>
            <div class="cocktail-card-footer">
                <span class="cocktail-card-spirit">
                    <span>${getSpiritLabel(cocktail.spirit)}</span>
                </span>
                <span class="cocktail-card-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </span>
            </div>
        `;

        cocktailGrid.appendChild(card);
    });
}

// ============ MODAL ============
function openModal(cocktail) {
    modalBody.innerHTML = `
        <div class="modal-hero" style="background: ${cocktail.gradient}">
            <span>${cocktail.emoji}</span>
        </div>
        <div class="modal-info">
            <div class="modal-category">${getCategoryLabel(cocktail.category)}</div>
            <h2 class="modal-name">${cocktail.name}</h2>
            <p class="modal-origin">${cocktail.year} · ${cocktail.creator} · ${cocktail.origin}</p>
            <p class="modal-history">${cocktail.history}</p>

            <div class="modal-ingredients">
                <h3 class="modal-section-title">Ingredientes</h3>
                <ul>
                    ${cocktail.ingredients.map(i => `<li>${i}</li>`).join('')}
                </ul>
            </div>

            <div class="modal-method">
                <h3 class="modal-section-title">Método de Preparación</h3>
                <p>${cocktail.method}</p>
            </div>

            <div class="modal-details">
                <div class="modal-detail">
                    <div class="modal-detail-label">Cristalería</div>
                    <div class="modal-detail-value">${cocktail.glass}</div>
                </div>
                <div class="modal-detail">
                    <div class="modal-detail-label">Decoración</div>
                    <div class="modal-detail-value">${cocktail.garnish}</div>
                </div>
                <div class="modal-detail">
                    <div class="modal-detail-label">Base</div>
                    <div class="modal-detail-value">${getSpiritLabel(cocktail.spirit)}</div>
                </div>
            </div>
        </div>
    `;

    cocktailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    cocktailModal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
cocktailModal.addEventListener('click', (e) => {
    if (e.target === cocktailModal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ============ FILTERS ============
spiritFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    spiritFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeSpirit = btn.dataset.filter;
    renderCocktails();
});

categoryFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    categoryFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.category;
    renderCocktails();
});

cocktailSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderCocktails();
});

// ============ NAVIGATION ============
// Scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Mobile toggle
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ============ ACCORDION ============
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
        const item = trigger.parentElement;
        const wasActive = item.classList.contains('active');

        // Close all
        document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

        // Toggle clicked
        if (!wasActive) {
            item.classList.add('active');
        }
    });
});

// ============ SCROLL REVEAL ============
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

// ============ COUNTER ANIMATION ============
function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(ease * target);

        el.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
    counterObserver.observe(el);
});

// ============ HERO PARTICLES ============
function createParticles() {
    const count = 30;
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        heroParticles.appendChild(particle);
    }
}

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = navbar.offsetHeight + 20;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============ ACTIVE NAV LINK ============
const sections = document.querySelectorAll('section[id]');
const navLinksAll = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    renderCocktails();
});
