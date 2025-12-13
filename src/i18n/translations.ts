export type Language = "es" | "en";

export const translations = {
  es: {
    // Header
    header: {
      title: "Resonancia Schumann",
      subtitle: "Lecturas diarias orientativas",
    },
    // Navigation
    nav: {
      today: "Hoy",
      history: "Histórico",
      library: "Biblioteca",
      acknowledgements: "Agradecimientos",
    },
    // Loading/Error states
    states: {
      loadingError: "No se pudieron cargar las lecturas. Intenta de nuevo más tarde.",
      noReadings: "Todavía no hay lecturas registradas. Vuelve más tarde.",
      noHistoricalReadings: "No hay lecturas históricas disponibles.",
    },
    // Today View
    today: {
      readingOfDay: "Lectura del día",
      geomagneticForecast: "Pronóstico de Actividad Geomagnética",
      kIndexDescription: "Índice K - Actividad geomagnética en tiempo real",
      technicalDescription: "Descripción técnica",
      physicalSensations: "Sensaciones físicas",
      emotionalSensations: "Sensaciones emocionales",
      recommendations: "Recomendaciones",
      communityChat: "Chat de la comunidad",
      communityChatDescription: "Conecta con otros miembros de la comunidad",
      disclaimer: "Esta información es orientativa y no sustituye asesoramiento médico profesional.",
    },
    // History View
    history: {
      title: "Histórico de Lecturas",
      searchByDate: "Buscar por fecha",
      showingReadingsFor: "Mostrando lecturas del",
      showingAllReadings: "Mostrando todas las lecturas",
      readingDetail: "Detalle de Lectura",
    },
    // Library View
    library: {
      title: "Biblioteca de Conocimiento",
      history: {
        title: "Historia",
        p1: "La resonancia fue predicha por primera vez por el físico Winfried Otto Schumann en 1952, y posteriormente fue observada y medida en los años siguientes. Nombrada en su honor, la resonancia de Schumann se ha convertido desde entonces en un punto de interés no solo para los científicos, sino también para entusiastas de diversas disciplinas.",
        p2: "Nikola Tesla es considerado influyente en el descubrimiento de las frecuencias de la resonancia de Schumann.",
      },
      whatIs: {
        title: "¿Qué es la Resonancia Schumann?",
        intro: "La resonancia de Schumann es un conjunto de frecuencias electromagnéticas que ocurren naturalmente en la atmósfera terrestre. Místicamente, a menudo se percibe como el \"latido del corazón\" de la Tierra o un reflejo de la conciencia del planeta.",
        frequency: "La frecuencia fundamental de la resonancia de Schumann es aproximadamente",
        frequencyNote: "(La Tierra básicamente vibra a esta frecuencia) y tiene varias frecuencias armónicas adicionales que incluyen",
        frequencyMatch: "Estas frecuencias coinciden en parte con las frecuencias cerebrales humanas, como las ondas alfa y theta, relacionadas con estados de relajación, meditación y sueño ligero.",
        naturalRhythms: "Ritmos Naturales:",
        naturalRhythmsDesc: "La resonancia de Schumann es una manifestación de los ritmos naturales de la Tierra, muy similar a las ondas cerebrales en los humanos. Se cree que conecta a todos los seres vivos con el pulso energético del planeta.",
        humanConnection: "Conexión Humana:",
        humanConnectionDesc: "Los místicos creen que los humanos pueden sintonizar estas frecuencias para el crecimiento espiritual y la sanación. Se dice que la resonancia influye en la conciencia humana, las emociones y el bienestar físico, fomentando una conexión más profunda con la Tierra.",
        harmonicBalance: "Equilibrio Armónico:",
        harmonicBalanceDesc: "Estas frecuencias se ven como un equilibrio armónico entre la Tierra y la ionosfera. Las disrupciones en la resonancia podrían reflejar cambios globales o cósmicos, potencialmente afectando el comportamiento y la conciencia humana.",
        spiritualAwakening: "Despertar Espiritual:",
        spiritualAwakeningDesc: "Algunas tradiciones espirituales sugieren que el aumento de la frecuencia de la resonancia de Schumann señala un cambio en la conciencia humana, un movimiento hacia una mayor conciencia espiritual e iluminación.",
        meditativeStates: "Estados Meditativos:",
        meditativeStatesDesc: "Prácticas como la meditación, el grounding (conexión con la tierra) y la atención plena se creen que ayudan a los individuos a alinearse con la resonancia de Schumann, promoviendo la paz interior y una sensación de unidad con la energía de la Tierra.",
      },
      brainwaves: {
        title: "Frecuencias de resonancia de Schumann y frecuencias cerebrales humanas",
        intro: "Las ondas cerebrales se han clasificado en rangos de frecuencia distintos, generalmente asociados con diferentes regiones cerebrales y estados de conciencia. Los diferentes tipos de ondas cerebrales son los siguientes:",
        delta: "Ondas delta (0-4 Hz)",
        deltaDesc: "Se asocian con sueño muy profundo, la mente subconsciente, emociones y el sistema endocrino.",
        theta: "Ondas theta (4-8 Hz)",
        thetaDesc: "Se asocian con sueño REM, relajación profunda, estados creativos de la mente y aprendizaje.",
        alpha: "Ondas alfa (8-12 Hz)",
        alphaDesc: "Se asocian con relajación con ojos cerrados, estados mentales calmados, flujo enfocado, reflexión y visualización.",
        beta: "Ondas beta (12-30 Hz)",
        betaDesc: "Se asocian con conciencia despierta, alerta, concentración y estados mentales enfocados.",
        gamma: "Ondas gamma (30+ Hz)",
        gammaDesc: "Se asocian con conciencia superior, resolución de problemas, estados altamente creativos y meditativos, sincronización generalizada de ondas cerebrales, ideación e insights.",
        overlay: "Si superpones las resonancias de Schumann sobre las ondas cerebrales humanas, obtienes lo siguiente:",
        freq78: "frecuencia Schumann (ondas cerebrales theta superior y alfa inferior)",
        freq14: "frecuencia Schumann (ondas cerebrales beta bajas)",
        freq20: "frecuencia Schumann (ondas cerebrales beta medias)",
        freq25: "frecuencia Schumann (ondas cerebrales beta superiores)",
        freq33: "frecuencia Schumann (ondas cerebrales gamma)",
      },
      effects: {
        title: "Por qué se habla de sus efectos",
        environmentalEffects: "Efectos Ambientales",
        environmentalEffectsDesc: "El cerebro utiliza un sistema oscilante ELF (Extremely Low Frequency), haciendo uso principalmente de iones de calcio para controlar neurotransmisores. Las señales ELF externas inducen eflujos de iones de calcio en neuronas alterados en el tejido cerebral. Los animales y los humanos han evolucionado en un ambiente saturado por la señal SR durante aproximadamente 3 mil millones de años. La sincronización estable del cerebro mediante señales SR ha conducido al pensamiento, la emoción, la memoria y la inteligencia. El cerebro tiene transmisores y receptores electromagnéticos en las neuronas.",
        sgmaActivity: "Actividad S/GMA (Solar/Geomagnética)",
        sgmaDesc1: "La actividad S/GMA ha demostrado afectar la amplitud (fortaleza) de la señal SR, y como sabemos, el ciclo de resonancia de Schumann afecta a los seres humanos.",
        sgmaDesc2: "Las correlaciones entre el número de manchas solares y los índices de actividad GMA también coinciden con ciertos efectos en la salud.",
        sgmaDesc3: "La radiación de rayos X y rayos gamma de los vientos solares tienen un impacto en la fortaleza de la señal SR y pueden alterar el ciclo diurno.",
        sgmaDesc4: "Los rayos X ionizan los átomos con los que entran en contacto e incrementan la concentración de iones en la región D de la ionosfera. La región D es la parte superior de la cavidad ionosférica en la cual existe la señal SR.",
        sgmaDesc5: "La variación diaria en la región D produce la variación en la señal SR. Las tormentas solares también se sabe que producen variaciones en la señal SR.",
      },
      graphs: {
        title: "Cómo leemos estas gráficas",
        xAxis: "Eje X:",
        xAxisDesc: "Representa el tiempo, en horas, utilizando la Hora de Verano de Tomsk (TLVA UTC+7)",
        yAxis: "Eje Y:",
        yAxisDesc: "Representa la frecuencia entre 0 y 40 Hz",
        date: "Fecha:",
        dateDesc: "Se muestra una serie de tres fechas horizontalmente en la parte superior del gráfico en orden de izquierda a derecha.",
        hour: "Hora:",
        hourDesc: "Para cada día se muestra una secuencia de 0-24 horas horizontalmente en la parte inferior del gráfico. La zona horaria corresponde a la ubicación de la estación de monitoreo, Hora de Verano de Tomsk (TLVA).",
        color: "Color:",
        colorDesc: "Indica amplitud (fortaleza/intensidad), el negro y azul son los colores de fondo y luego la escala se mueve desde verde pasando por rojo hasta la amplitud más alta representada en blanco.",
        exampleVisual: "Ejemplo visual de gráfica de Resonancia Schumann:",
      },
      stations: {
        title: "Estaciones de monitoreo",
        tomskNote: "(Nosotros usamos estos datos)",
      },
      popCulture: {
        title: "Cultura popular",
        intro: "A lo largo de los años, la resonancia de Schumann ha sido objeto de numerosas especulaciones, mitos e interpretaciones, especialmente en el ámbito de la medicina alternativa, comunidades metafísicas y creencias New Age.",
        newAge: "Espiritualidad New Age:",
        newAgeDesc: "Algunos proponentes en la comunidad New Age creen que la resonancia de Schumann está estrechamente vinculada a la conciencia humana. Sugieren que cambios o alteraciones en estas frecuencias pueden influir en la salud física, el bienestar mental y el crecimiento espiritual.",
        altMedicine: "Medicina Alternativa:",
        altMedicineDesc: "Algunos practicantes de salud alternativa afirman que dispositivos o terapias que imitan o armonizan con la resonancia de Schumann pueden provocar curación o equilibrio en el cuerpo.",
        musicArt: "Música y Arte:",
        musicArtDesc: "El concepto de que la Tierra tiene un \"latido del corazón\" ha inspirado a numerosos artistas, músicos y escritores.",
        filmTv: "Cine y Televisión:",
        filmTvDesc: "La resonancia de Schumann ha sido ocasionalmente un elemento de la trama en géneros de ciencia ficción y paranormales. Como el icónico anime Serial Experiments Lain.",
      },
      limitations: {
        title: "Limitaciones y Nota de Responsabilidad",
        intro: "Si bien la resonancia de Schumann es un fenómeno real y bien documentado, gran parte de la información presentada aquí se basa en interpretaciones espirituales, metafísicas y de medicina alternativa que no han sido validadas científicamente.",
        point1: "Las afirmaciones sobre los efectos de la resonancia de Schumann en la salud humana, la conciencia o el bienestar espiritual carecen de respaldo científico sólido.",
        point2: "Esta información se proporciona únicamente con fines educativos y de entretenimiento.",
        point3: "No debe utilizarse como sustituto de asesoramiento médico, diagnóstico o tratamiento profesional.",
        point4: "Siempre consulte a profesionales de la salud calificados para cualquier problema de salud.",
        finalNote: "Te invitamos a explorar este fascinante tema con mente abierta pero también con pensamiento crítico.",
      },
    },
    // Acknowledgements View
    acknowledgements: {
      title: "Agradecimientos",
      creators: {
        title: "Nuestros creadores",
        p1: "El agradecimiento es a esos niños de las estrellas, que vinieron en oleadas desde los 80s para elevar la frecuencia del planeta con un solo ingrediente, el amor.",
        p2: "A todas esas almas que vinieron de manera voluntaria a este momento de la historia, que no siguieron un camino prediseñado y construyeron su propio camino.",
        p3: "Los niños de las estrellas están aquí y vienen con un propósito, recordar el libre albedrío de elegir.",
      },
      thanks: {
        musa: "por la colaboración en construir la primera comunidad de información acerca de la resonancia de schumann en habla hispana.",
        tomsk: "por monitorear estos datos y compartirlos.",
        sos70: "que también hace posible que estos datos sean públicos.",
        thanksTo: "Gracias a",
        thanksToThe: "Gracias al",
      },
    },
    // Activity levels
    activityLevels: {
      low: "Baja",
      medium: "Media",
      high: "Alta",
      veryHigh: "Muy alta",
    },
    // 404 Page
    notFound: {
      title: "404",
      message: "¡Ups! Página no encontrada",
      backHome: "Volver al inicio",
    },
  },
  en: {
    // Header
    header: {
      title: "Schumann Resonance",
      subtitle: "Daily indicative readings",
    },
    // Navigation
    nav: {
      today: "Today",
      history: "History",
      library: "Library",
      acknowledgements: "Acknowledgements",
    },
    // Loading/Error states
    states: {
      loadingError: "Could not load readings. Please try again later.",
      noReadings: "No readings recorded yet. Check back later.",
      noHistoricalReadings: "No historical readings available.",
    },
    // Today View
    today: {
      readingOfDay: "Today's reading",
      geomagneticForecast: "Geomagnetic Activity Forecast",
      kIndexDescription: "K-Index - Real-time geomagnetic activity",
      technicalDescription: "Technical description",
      physicalSensations: "Physical sensations",
      emotionalSensations: "Emotional sensations",
      recommendations: "Recommendations",
      communityChat: "Community Chat",
      communityChatDescription: "Connect with other community members",
      disclaimer: "This information is indicative and does not replace professional medical advice.",
    },
    // History View
    history: {
      title: "Reading History",
      searchByDate: "Search by date",
      showingReadingsFor: "Showing readings for",
      showingAllReadings: "Showing all readings",
      readingDetail: "Reading Detail",
    },
    // Library View
    library: {
      title: "Knowledge Library",
      history: {
        title: "History",
        p1: "The resonance was first predicted by physicist Winfried Otto Schumann in 1952, and was subsequently observed and measured in the following years. Named in his honor, the Schumann resonance has since become a point of interest not only for scientists but also for enthusiasts from various disciplines.",
        p2: "Nikola Tesla is considered influential in the discovery of Schumann resonance frequencies.",
      },
      whatIs: {
        title: "What is the Schumann Resonance?",
        intro: "The Schumann resonance is a set of electromagnetic frequencies that occur naturally in Earth's atmosphere. Mystically, it is often perceived as the \"heartbeat\" of Earth or a reflection of the planet's consciousness.",
        frequency: "The fundamental frequency of the Schumann resonance is approximately",
        frequencyNote: "(Earth basically vibrates at this frequency) and has several additional harmonic frequencies including",
        frequencyMatch: "These frequencies partially coincide with human brain frequencies, such as alpha and theta waves, related to states of relaxation, meditation, and light sleep.",
        naturalRhythms: "Natural Rhythms:",
        naturalRhythmsDesc: "The Schumann resonance is a manifestation of Earth's natural rhythms, much like brainwaves in humans. It is believed to connect all living beings to the planet's energetic pulse.",
        humanConnection: "Human Connection:",
        humanConnectionDesc: "Mystics believe that humans can tune into these frequencies for spiritual growth and healing. The resonance is said to influence human consciousness, emotions, and physical well-being, fostering a deeper connection with Earth.",
        harmonicBalance: "Harmonic Balance:",
        harmonicBalanceDesc: "These frequencies are seen as a harmonic balance between Earth and the ionosphere. Disruptions in the resonance could reflect global or cosmic changes, potentially affecting human behavior and consciousness.",
        spiritualAwakening: "Spiritual Awakening:",
        spiritualAwakeningDesc: "Some spiritual traditions suggest that the increase in Schumann resonance frequency signals a shift in human consciousness, a movement toward greater spiritual awareness and enlightenment.",
        meditativeStates: "Meditative States:",
        meditativeStatesDesc: "Practices such as meditation, grounding, and mindfulness are believed to help individuals align with the Schumann resonance, promoting inner peace and a sense of unity with Earth's energy.",
      },
      brainwaves: {
        title: "Schumann Resonance Frequencies and Human Brainwave Frequencies",
        intro: "Brainwaves have been classified into distinct frequency ranges, generally associated with different brain regions and states of consciousness. The different types of brainwaves are as follows:",
        delta: "Delta waves (0-4 Hz)",
        deltaDesc: "Associated with very deep sleep, the subconscious mind, emotions, and the endocrine system.",
        theta: "Theta waves (4-8 Hz)",
        thetaDesc: "Associated with REM sleep, deep relaxation, creative states of mind, and learning.",
        alpha: "Alpha waves (8-12 Hz)",
        alphaDesc: "Associated with relaxation with closed eyes, calm mental states, focused flow, reflection, and visualization.",
        beta: "Beta waves (12-30 Hz)",
        betaDesc: "Associated with waking consciousness, alertness, concentration, and focused mental states.",
        gamma: "Gamma waves (30+ Hz)",
        gammaDesc: "Associated with higher consciousness, problem-solving, highly creative and meditative states, widespread brainwave synchronization, ideation, and insights.",
        overlay: "If you overlay Schumann resonances over human brainwaves, you get the following:",
        freq78: "Schumann frequency (upper theta and lower alpha brainwaves)",
        freq14: "Schumann frequency (low beta brainwaves)",
        freq20: "Schumann frequency (mid beta brainwaves)",
        freq25: "Schumann frequency (upper beta brainwaves)",
        freq33: "Schumann frequency (gamma brainwaves)",
      },
      effects: {
        title: "Why We Talk About Its Effects",
        environmentalEffects: "Environmental Effects",
        environmentalEffectsDesc: "The brain uses an ELF (Extremely Low Frequency) oscillating system, primarily using calcium ions to control neurotransmitters. External ELF signals induce altered calcium ion effluxes in neurons in brain tissue. Animals and humans have evolved in an environment saturated by the SR signal for approximately 3 billion years. Stable brain synchronization through SR signals has led to thought, emotion, memory, and intelligence. The brain has electromagnetic transmitters and receivers in neurons.",
        sgmaActivity: "S/GMA Activity (Solar/Geomagnetic)",
        sgmaDesc1: "S/GMA activity has been shown to affect the amplitude (strength) of the SR signal, and as we know, the Schumann resonance cycle affects humans.",
        sgmaDesc2: "Correlations between sunspot numbers and GMA activity indices also coincide with certain health effects.",
        sgmaDesc3: "X-ray and gamma ray radiation from solar winds have an impact on SR signal strength and can alter the diurnal cycle.",
        sgmaDesc4: "X-rays ionize atoms they come into contact with and increase ion concentration in the D region of the ionosphere. The D region is the upper part of the ionospheric cavity in which the SR signal exists.",
        sgmaDesc5: "Daily variation in the D region produces variation in the SR signal. Solar storms are also known to produce variations in the SR signal.",
      },
      graphs: {
        title: "How We Read These Graphs",
        xAxis: "X-Axis:",
        xAxisDesc: "Represents time, in hours, using Tomsk Daylight Time (TLVA UTC+7)",
        yAxis: "Y-Axis:",
        yAxisDesc: "Represents frequency between 0 and 40 Hz",
        date: "Date:",
        dateDesc: "A series of three dates is shown horizontally at the top of the graph in order from left to right.",
        hour: "Hour:",
        hourDesc: "For each day, a sequence of 0-24 hours is shown horizontally at the bottom of the graph. The timezone corresponds to the monitoring station location, Tomsk Daylight Time (TLVA).",
        color: "Color:",
        colorDesc: "Indicates amplitude (strength/intensity), black and blue are the background colors and then the scale moves from green through red to the highest amplitude represented in white.",
        exampleVisual: "Visual example of Schumann Resonance graph:",
      },
      stations: {
        title: "Monitoring Stations",
        tomskNote: "(We use this data)",
      },
      popCulture: {
        title: "Popular Culture",
        intro: "Over the years, the Schumann resonance has been the subject of numerous speculations, myths, and interpretations, especially in the realm of alternative medicine, metaphysical communities, and New Age beliefs.",
        newAge: "New Age Spirituality:",
        newAgeDesc: "Some proponents in the New Age community believe that the Schumann resonance is closely linked to human consciousness. They suggest that changes or alterations in these frequencies can influence physical health, mental well-being, and spiritual growth.",
        altMedicine: "Alternative Medicine:",
        altMedicineDesc: "Some alternative health practitioners claim that devices or therapies that mimic or harmonize with the Schumann resonance can bring about healing or balance in the body.",
        musicArt: "Music and Art:",
        musicArtDesc: "The concept that Earth has a \"heartbeat\" has inspired numerous artists, musicians, and writers.",
        filmTv: "Film and Television:",
        filmTvDesc: "The Schumann resonance has occasionally been a plot element in science fiction and paranormal genres. Like the iconic anime Serial Experiments Lain.",
      },
      limitations: {
        title: "Limitations and Disclaimer",
        intro: "While the Schumann resonance is a real and well-documented phenomenon, much of the information presented here is based on spiritual, metaphysical, and alternative medicine interpretations that have not been scientifically validated.",
        point1: "Claims about the effects of Schumann resonance on human health, consciousness, or spiritual well-being lack solid scientific support.",
        point2: "This information is provided for educational and entertainment purposes only.",
        point3: "It should not be used as a substitute for professional medical advice, diagnosis, or treatment.",
        point4: "Always consult qualified healthcare professionals for any health concerns.",
        finalNote: "We invite you to explore this fascinating topic with an open mind but also with critical thinking.",
      },
    },
    // Acknowledgements View
    acknowledgements: {
      title: "Acknowledgements",
      creators: {
        title: "Our Creators",
        p1: "Our gratitude goes to those star children, who came in waves since the 80s to raise the planet's frequency with a single ingredient: love.",
        p2: "To all those souls who voluntarily came to this moment in history, who did not follow a pre-designed path and built their own way.",
        p3: "The star children are here and they come with a purpose: to remember the free will to choose.",
      },
      thanks: {
        musa: "for collaborating in building the first Spanish-speaking community about the Schumann resonance.",
        tomsk: "for monitoring this data and sharing it.",
        sos70: "which also makes this data publicly available.",
        thanksTo: "Thanks to",
        thanksToThe: "Thanks to the",
      },
    },
    // Activity levels
    activityLevels: {
      low: "Low",
      medium: "Medium",
      high: "High",
      veryHigh: "Very High",
    },
    // 404 Page
    notFound: {
      title: "404",
      message: "Oops! Page not found",
      backHome: "Return to Home",
    },
  },
} as const;

// Helper type to get a generic translations shape
type DeepStringify<T> = {
  [K in keyof T]: T[K] extends object ? DeepStringify<T[K]> : string;
};

export type TranslationKeys = DeepStringify<typeof translations.es>;
