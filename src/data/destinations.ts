export type Destination = {
    slug: string;
    name: string;
    image: string;
    description: string;
    topActivities: {
        name: string;
        icon: string;
    }[];
    hotelSpotlight: {
        name: string;
        image: string;
        description: string;
    }[];
};

export const destinations: Destination[] = [
    {
        slug: "santorini-greece",
        name: "Santorini, Greece",
        image: "https://plus.unsplash.com/premium_photo-1661964149725-fbf14eabd38c?q=80&w=1170&auto=format&fit=crop",
        description: "Famous for its stunning sunsets, iconic blue-domed churches, and whitewashed villages clinging to volcanic cliffs, Santorini is the jewel of the Aegean Sea. It offers a unique blend of romance, history, and natural beauty, making it a dream destination for couples and photographers alike.",
        topActivities: [
            { name: "Watch the Sunset in Oia", icon: "🌅" },
            { name: "Explore Fira's Cobblestone Streets", icon: "🚶‍♀️" },
            { name: "Swim in Hot Springs", icon: "♨️" },
            { name: "Visit Ancient Akrotiri", icon: "🏛️" },
            { name: "Wine Tasting Tour", icon: "🍷" },
        ],
        hotelSpotlight: [
            { name: "Canaves Oia Suites", image: "https://images.unsplash.com/photo-1617832629399-2bb33658535a?q=80&w=2070&auto=format&fit=crop", description: "Luxurious suites with private plunge pools offering breathtaking caldera views." },
            { name: "Grace Hotel", image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop", description: "An elegant clifftop hotel known for its minimalist design and stunning infinity pool." },
        ]
    },
    {
        slug: "kyoto-japan",
        name: "Kyoto, Japan",
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop",
        description: "The former imperial capital of Japan, Kyoto is a city of serene temples, sublime gardens, and traditional teahouses. It's the cultural heart of the country, where you can experience the elegance of a geisha dance, wander through a mystical bamboo grove, and savor refined kaiseki cuisine.",
        topActivities: [
            { name: "Visit Kinkaku-ji (Golden Pavilion)", icon: "🏯" },
            { name: "Walk Through Arashiyama Bamboo Grove", icon: "🎋" },
            { name: "Explore Fushimi Inari Shrine", icon: "⛩️" },
            { name: "Stroll Through Gion District", icon: "👘" },
            { name: "Experience a Traditional Tea Ceremony", icon: "🍵" },
        ],
        hotelSpotlight: [
            { name: "The Ritz-Carlton, Kyoto", image: "https://images.unsplash.com/photo-1598226667123-333799341213?q=80&w=2070&auto=format&fit=crop", description: "A luxury hotel on the banks of the Kamogawa river, offering a modern take on traditional Japanese hospitality." },
            { name: "Tawaraya Ryokan", image: "https://images.unsplash.com/photo-1622361668242-a05e5d3423c3?q=80&w=1932&auto=format&fit=crop", description: "One of Japan's most famous traditional inns, offering an authentic and serene ryokan experience." },
        ]
    },
    {
        slug: "amalfi-coast-italy",
        name: "Amalfi Coast, Italy",
        image: "https://images.unsplash.com/photo-1583844056361-4418a8f2a985?q=80&w=1169&auto=format&fit=crop",
        description: "A stunning stretch of coastline featuring sheer cliffs and a rugged shoreline dotted with small beaches and pastel-colored fishing villages. The coastal road between the port city of Salerno and clifftop Sorrento winds past grand villas, terraced vineyards, and cliffside lemon groves.",
        topActivities: [
            { name: "Drive the Amalfi Coast Road", icon: "🚗" },
            { name: "Visit Picturesque Positano", icon: "🏘️" },
            { name: "Take a Boat Trip to Capri", icon: "🚤" },
            { name: "Explore the Gardens of Villa Rufolo", icon: "🌸" },
            { name: "Hike the Path of the Gods", icon: "🥾" },
        ],
        hotelSpotlight: [
            { name: "Le Sirenuse, Positano", image: "https://images.unsplash.com/photo-1622332219943-8547434143a2?q=80&w=1964&auto=format&fit=crop", description: "A legendary, family-run hotel with stunning views over the bay of Positano." },
            { name: "Belmond Hotel Caruso", image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop", description: "A former 11th-century palace set on a cliff edge in Ravello, famous for its dramatic infinity pool." },
        ]
    },
    {
        slug: "the-bahamas",
        name: "The Bahamas, Caribbean",
        image: "https://images.unsplash.com/photo-1501698335706-90b736210a61?q=80&w=1074&auto=format&fit=crop",
        description: "An archipelago of 700 islands and cays, the Bahamas is renowned for its crystal-clear turquoise waters, pristine white-sand beaches, and vibrant coral reefs. It's a paradise for water sports enthusiasts, sun-seekers, and those looking for a luxurious tropical escape.",
        topActivities: [
            { name: "Swim with Pigs in Exuma", icon: "🐷" },
            { name: "Snorkel or Dive the Andros Barrier Reef", icon: "🐠" },
            { name: "Relax on Pink Sands Beach, Harbour Island", icon: "🏖️" },
            { name: "Explore Nassau's Historic Sites", icon: "🏛️" },
            { name: "Go Deep-Sea Fishing", icon: "🎣" },
        ],
        hotelSpotlight: [
            { name: "Atlantis Paradise Island", image: "https://tempo.cdn.tambourine.com/windsong/media/cache/screen-shot-2020-12-08-at-8_24_24-am-5fcf7ee6430ac-1500x643.png", description: "A sprawling resort with a massive water park, marine habitats, and a casino." },
            { name: "The Cove at Atlantis", image: "https://cache.marriott.com/content/dam/marriott-renditions/NASCV/nascv-exterior-0063-hor-clsc.jpg?output-quality=70&interpolation=progressive-bilinear&downsize=1336px:*", description: "An upscale, adults-only retreat within Atlantis, offering luxurious suites and private pools." },
            { name: "Margaritaville Beach Resort", image: "https://tempo.cdn.tambourine.com/windsong/media/cache/dji_0077-resized-671af8c5d21ab-1500x643.jpg", description: "Nassau's newest resort is truly the heartbeat of island life, Margaritaville Beach Resort allows visitors to enjoy all the island has to offer with its perfectly situated location and spectacular amenities." },
        ]
    },
        {
        slug: "walt-disney-world-florida",
        name: "Walt Disney World, Florida",
        image: "https://blooloop.com/wp-content/uploads/2019/03/Happily-Ever-After-fireworks-Magic-Kingdom-1024x576.jpeg",
        description: "The most magical place on Earth, Walt Disney World Resort in Florida is an expansive entertainment complex featuring four theme parks, two water parks, and numerous resorts. It's a dream destination for families and Disney enthusiasts of all ages, offering immersive experiences, thrilling rides, and beloved characters.",
        topActivities: [
            { name: "Explore Magic Kingdom", icon: "🏰" },
            { name: "Experience Epcot's World Showcase", icon: "🌐" },
            { name: "Ride Avatar Flight of Passage at Animal Kingdom", icon: "🌳" },
            { name: "Watch Fireworks at Cinderella Castle", icon: "🎆" },
            { name: "Meet Disney Characters", icon: "🐭" },
        ],
        hotelSpotlight: [
            { name: "Disney's Contemporary Resort", image: "https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/900/360/75/dam/wdpro-assets/places-to-stay/contemporary/contemporary-resort-00-full.jpg", description: "A modern resort with a monorail running through it, offering stunning views of Magic Kingdom." },
            { name: "Disney's Grand Floridian Resort & Spa", image: "https://cdn1.parksmedia.wdprapps.disney.com/resize/mwImage/1/640/360/75/vision-dam/digital/parks-platform/parks-global-assets/disney-world/resorts/grand-floridian/0821ZM_0873SD_JRoh_R2-16x9.jpg", description: "A Victorian-themed luxury resort known for its elegance and proximity to Magic Kingdom." },
        ]
    },
    {
        slug: "maui-hawaii",
        name: "Maui, Hawaii",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop",
        description: "Known as the 'Valley Isle,' Maui offers a diverse landscape from volcanic craters to lush rainforests and world-class beaches. It's a haven for outdoor adventures, stunning scenic drives, and a relaxed island vibe.",
        topActivities: [
            { name: "Drive the Road to Hana", icon: "🚗" },
            { name: "Watch Sunrise from Haleakalā Crater", icon: "🌅" },
            { name: "Snorkel at Molokini Crater", icon: "🐠" },
            { name: "Learn to Surf in Lahaina", icon: "🏄‍♀️" },
            { name: "Attend a Luau", icon: "🌺" },
        ],
        hotelSpotlight: [
            { name: "Grand Wailea, A Waldorf Astoria Resort", image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop", description: "A luxurious oceanfront resort with a renowned spa and an elaborate pool complex." },
            { name: "Hotel Wailea, Relais & Châteaux", image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop", description: "An adults-only, all-suite hotel offering panoramic ocean views and a tranquil atmosphere." },
        ]
    },
    {
        slug: "london-england",
        name: "London, England",
        image: "https://plus.unsplash.com/premium_photo-1661962264190-1c3c59453bdc?q=80&w=880&auto=format&fit=crop",
        description: "A vibrant global city with a rich history, iconic landmarks, and a thriving cultural scene. From ancient castles to modern art galleries, London offers an endless array of experiences for every traveler.",
        topActivities: [
            { name: "Visit the Tower of London", icon: "🏰" },
            { name: "Ride the London Eye", icon: "🎡" },
            { name: "Explore the British Museum", icon: "🏛️" },
            { name: "See a West End Show", icon: "🎭" },
            { name: "Stroll Through Hyde Park", icon: "🌳" },
        ],
        hotelSpotlight: [
            { name: "The Savoy", image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop", description: "A legendary luxury hotel on the River Thames, known for its opulent decor and historic charm." },
            { name: "Shangri-La Hotel at The Shard, London", image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop", description: "Offers breathtaking panoramic views of London from within the iconic Shard skyscraper." },
        ]
    },
    {
        slug: "dublin-ireland",
        name: "Dublin, Ireland",
        image: "https://images.unsplash.com/photo-1706849668074-98c6837b3462?q=80&w=1320&auto=format&fit=crop",
        description: "Ireland's capital, Dublin is a city of literary giants, lively pubs, and rich history. Its friendly atmosphere, Georgian architecture, and vibrant cultural scene make it a captivating destination.",
        topActivities: [
            { name: "Tour the Guinness Storehouse", icon: "🍺" },
            { name: "Explore Trinity College and the Book of Kells", icon: "📚" },
            { name: "Stroll Through Temple Bar", icon: "🎶" },
            { name: "Visit Dublin Castle", icon: "🏰" },
            { name: "Discover St. Patrick's Cathedral", icon: "⛪" },
        ],
        hotelSpotlight: [
            { name: "The Shelbourne, Autograph Collection", image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop", 
            description: "A historic and elegant hotel overlooking St. Stephen's Green, a Dublin landmark." },
            { name: "The Merrion Hotel", image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop", 
            description: "A luxurious hotel set in four Georgian townhouses, featuring a private art collection and a beautiful garden." },
        ]
    },
    {
        slug: "machu-picchu-peru",
        name: "Machu Picchu, Peru",
        image: "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?q=80&w=1170&auto=format&fit=crop",
        description: "The ancient Inca city of Machu Picchu, nestled high in the Andes Mountains, is one of the world's most iconic archaeological sites. Its breathtaking setting, intricate stone architecture, and mysterious history draw visitors from across the globe.",
        topActivities: [
            { name: "Hike the Inca Trail", icon: "🥾" },
            { name: "Explore the Citadel of Machu Picchu", icon: "⛰️" },
            { name: "Climb Huayna Picchu or Machu Picchu Mountain", icon: "🧗‍♀️" },
            { name: "Visit Aguas Calientes", icon: "♨️" },
            { name: "Bird Watching", icon: "🐦" },
        ],
        hotelSpotlight: [
            { name: "Belmond Sanctuary Lodge", image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop", description: "The only hotel located adjacent to the ancient citadel, offering unparalleled access and stunning views." },
            { name: "Sumaq Machu Picchu Hotel", image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop", description: "A luxury hotel in Aguas Calientes, blending modern comfort with traditional Andean design." },
        ]
    },
];


export function getDestinationBySlug(slug: string): Destination | undefined {
    return destinations.find((destination) => destination.slug === slug);
}
