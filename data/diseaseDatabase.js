// Local Agricultural Disease Database and Diagnostic Engine (ICAR/KVK trusted guidelines)
// Provides instant, highly accurate symptom-based crop disease predictions in multiple languages.

const genericDiseases = {
    "fungal": {
        "name": {
            "en": "Fungal Leaf Spot & Wilt",
            "gu": "ફૂગજન્ય રોગ અને સુકારો",
            "hi": "फंगल पत्ती धब्बा और सूखा रोग"
        },
        "explanation": {
            "en": "Fungal infection caused by spores, leading to spots, powder coatings, rots, or plant wilting.",
            "gu": "ફૂગથી થતો ચેપ, જેના કારણે પાંદડા પર ડાઘ, પાવડર, સડો અથવા સુકારો થાય છે.",
            "hi": "कवक के कारण होने वाला संक्रमण, जिससे धब्बे, सफ़ेद परत, सड़न या सूखा रोग होता है।"
        },
        "severity": "Yellow",
        "recovery": {
            "chances": "High",
            "time": { "en": "7-10 days", "gu": "૭-૧૦ દિવસ", "hi": "७-१० दिन" },
            "unrecoverable_signs": {
                "en": "If the main stem rots and plant wilts completely.",
                "gu": "જો મુખ્ય થડ સડી જાય અને છોડ આખો સુકાઈ જાય.",
                "hi": "यदि मुख्य तना सड़ जाए और पौधा पूरी तरह सूख जाए।"
            }
        }
    },
    "bacterial": {
        "name": {
            "en": "Bacterial Blight / Canker",
            "gu": "બેક્ટેરિયલ સુકારો / કેન્કર",
            "hi": "बैक्टीरियल ब्लाइट / कैंकर"
        },
        "explanation": {
            "en": "Bacterial disease causing water-soaked spots, cankers, or vascular wilt.",
            "gu": "બેક્ટેરિયાથી થતો રોગ જેના લીધે પાણીયુક્ત ડાઘ, ચાંદા કે સુકારો થાય છે.",
            "hi": "जीवाणु रोग जिससे पानी जैसे धब्बे, घाव या सूखा रोग होता है।"
        },
        "severity": "Red",
        "recovery": {
            "chances": "Medium",
            "time": { "en": "10-14 days", "gu": "૧૦-૧૪ દિવસ", "hi": "१०-१४ दिन" },
            "unrecoverable_signs": {
                "en": "If stem shows slimy bacterial ooze and plant collapses.",
                "gu": "જો થડમાંથી ચીકણો સ્ત્રાવ વહે અને છોડ નમી પડે.",
                "hi": "यदि तने से चिपचिपा जीवाणु स्राव निकले और पौधा गिर जाए।"
            }
        }
    },
    "viral": {
        "name": {
            "en": "Leaf Curl / Mosaic Virus",
            "gu": "પર્ણ કોકડવાળ / મોઝેક વાયરસ",
            "hi": "पर्ण कुंचन / मोज़ेक वायरस"
        },
        "explanation": {
            "en": "Viral infection causing leaf curling, mottling, and stunted growth.",
            "gu": "વાયરસથી થતો રોગ જેના કારણે પાંદડા વળી જાય છે અને વૃદ્ધિ અટકે છે.",
            "hi": "वायरस संक्रमण जिससे पत्तियां मुड़ जाती हैं और विकास रुक जाता है।"
        },
        "severity": "Red",
        "recovery": {
            "chances": "Low",
            "time": { "en": "15-20 days", "gu": "૧૫-૨૦ દિવસ", "hi": "१५-२० दिन" },
            "unrecoverable_signs": {
                "en": "If new leaves stop growing and plant is severely stunted.",
                "gu": "જો નવા પાંદડા ઉગવાના બંધ થાય અને છોડ સાવ નાનો રહી જાય.",
                "hi": "यदि नए पत्ते उगना बंद हो जाएं और पौधा पूरी तरह बौना रह जाए।"
            }
        }
    },
    "pest": {
        "name": {
            "en": "Insect Pest Attack / Stem Borer",
            "gu": "જીવાતનો ઉપદ્રવ / થડ કોરી ખાનાર જીવાત",
            "hi": "कीटों का प्रकोप / तना छेदक"
        },
        "explanation": {
            "en": "Damage caused by insect pests feeding on leaves, stems, or fruits.",
            "gu": "જીવાતો પાંદડા, થડ અથવા ફળો કોરી ખાય છે તેના લીધે થતું નુકસાન.",
            "hi": "कीटों द्वारा पत्तियों, तनों या फलों को खाने से होने वाला नुकसान।"
        },
        "severity": "Red",
        "recovery": {
            "chances": "Medium",
            "time": { "en": "7-10 days", "gu": "૭-૧૦ દિવસ", "hi": "७-१० दिन" },
            "unrecoverable_signs": {
                "en": "If the growing tip or fruit is fully destroyed by borers.",
                "gu": "જો નવી ફૂટ કે ફળ જીવાતો દ્વારા સંપૂર્ણ નાશ પામે.",
                "hi": "यदि बढ़ती हुई कली या फल पूरी तरह से कीटों द्वारा नष्ट कर दिए जाएं।"
            }
        }
    },
    "nutrient": {
        "name": {
            "en": "Nutrient / Mineral Deficiency",
            "gu": "પોષક તત્વોની ઉણપ / ખામી",
            "hi": "पोषक तत्वों / खनिजों की कमी"
        },
        "explanation": {
            "en": "Lack of essential macro or micronutrients causing chlorosis and poor yield.",
            "gu": "મહત્વના પોષક તત્વોની ઉણપ જેના કારણે પીળાશ અને ઓછું ઉત્પાદન આવે છે.",
            "hi": "आवश्यक पोषक तत्वों की कमी जिससे पीलापन और कम पैदावार होती है।"
        },
        "severity": "Green",
        "recovery": {
            "chances": "High",
            "time": { "en": "5-7 days", "gu": "૫-૭ દિવસ", "hi": "५-૭ दिन" },
            "unrecoverable_signs": {
                "en": "If leaves dry up completely and dry from edges.",
                "gu": "જો પાંદડા કિનારીઓથી સુકાઈને આખા ખરી જાય.",
                "hi": "यदि पत्तियां किनारों से सूखकर पूरी तरह गिर जाएं।"
            }
        }
    }
};

const customDiseases = {
    "cotton": {
        "fungal": {
            "name": {
                "en": "Alternaria Leaf Spot / Anthracnose",
                "gu": "અલ્ટરનેરિયા પર્ણ ટપકાં / કાળી ફૂગ",
                "hi": "अल्टरनेरिया पत्ती धब्बा / एन्थ्रेक्नोज"
            },
            "explanation": {
                "en": "A fungal disease causing small brown spots on leaves and rot on bolls.",
                "gu": "એક ફૂગજન્ય રોગ જે પાંદડા પર નાના ભૂરા ટપકાં અને ઝીંડવા પર સડો પેદા કરે છે.",
                "hi": "एक फंगल रोग जिसके कारण पत्तियों पर छोटे भूरे धब्बे और डोडो पर सड़न होती है।"
            },
            "severity": "Yellow",
            "recovery": {
                "chances": "High",
                "time": { "en": "10-14 days", "gu": "૧૦-૧૪ દિવસ", "hi": "१०-१४ दिन" },
                "unrecoverable_signs": {
                    "en": "If more than 60% of bolls rot and plant wilts completely.",
                    "gu": "જો ૬૦% થી વધુ ઝીંડવા સડી જાય અને છોડ સુકાઈ જાય.",
                    "hi": "यदि ६०% से अधिक डोडे सड़ जाएं और पौधा पूरी तरह मुरझा जाए।"
                }
            }
        },
        "bacterial": {
            "name": {
                "en": "Bacterial Blight / Black Arm",
                "gu": "બેક્ટેરિયલ સુકારો / બ્લેક આર્મ",
                "hi": "जीवाणु झुलसा / ब्लैक आर्म"
            },
            "explanation": {
                "en": "A bacterial disease leading to angular black spots on leaves and dark stem lesions.",
                "gu": "એક જીવાણુ રોગ જે પાંદડા પર કોણીય કાળા ટપકાં અને થડ પર કાળા જખમ બનાવે છે.",
                "hi": "एक जीवाणु रोग जिससे पत्तियों पर कोणीय काले धब्बे और तने पर गहरे घाव होते हैं।"
            },
            "severity": "Red",
            "recovery": {
                "chances": "Medium",
                "time": { "en": "14-20 days", "gu": "૧૪-૨૦ દિવસ", "hi": "१४-२० दिन" },
                "unrecoverable_signs": {
                    "en": "If black arm lesions girdle the main stem causing it to snap.",
                    "gu": "જો બ્લેક આર્મ જખમ મુખ્ય થડને ઘેરી લે અને થડ ભાંગી જાય.",
                    "hi": "यदि ब्लैक आर्म के घाव मुख्य तने को घेर लें और तना टूट जाए।"
                }
            }
        },
        "viral": {
            "name": {
                "en": "Cotton Leaf Curl Virus (CLCuV)",
                "gu": "કપાસ પર્ણ કોકડવાળ વાયરસ",
                "hi": "कपास पर्ण कुंचन विषाणु"
            },
            "explanation": {
                "en": "A viral disease transmitted by whiteflies, causing leaves to curl and twist.",
                "gu": "સફેદ માખી દ્વારા ફેલાતો વાયરસ, જેનાથી પાંદડા વળી જાય છે અને કદ નાનું થાય છે.",
                "hi": "सफेद मक्खी द्वारा फैलने वाला वायरस, जिससे पत्तियां मुड़ जाती हैं और विकास रुक जाता है।"
            },
            "severity": "Red",
            "recovery": {
                "chances": "Low",
                "time": { "en": "21-30 days", "gu": "૨૧-૩૦ દિવસ", "hi": "२१-३० दिन" },
                "unrecoverable_signs": {
                    "en": "If the leaves cup upwards completely and plant growth stops.",
                    "gu": "જો પાંદડા સંપૂર્ણ કોકડાઈ જાય અને છોડનો વિકાસ અટકી જાય.",
                    "hi": "यदि पत्तियां पूरी तरह से मुड़ जाएं और पौधे का विकास रुक जाए।"
                }
            }
        },
        "pest": {
            "name": {
                "en": "Pink Bollworm / Sucking Pest Attack",
                "gu": "ગુલાબી ઈયળ / ચૂસિયા જીવાતોનો ઉપદ્રવ",
                "hi": "गुलाबी सूंडी / चूसक कीटों का हमला"
            },
            "explanation": {
                "en": "Pest infestation causing boll shedding and chewing damage on crop parts.",
                "gu": "જીવાતનો ઉપદ્રવ જેના કારણે ઝીંડવા ખરી જાય છે અને ઈયળો નુકસાન કરે છે.",
                "hi": "कीटों का प्रकोप जिससे डोडे झड़ते हैं और इल्लियां फसल को नुकसान पहुंचाती हैं।"
            },
            "severity": "Red",
            "recovery": {
                "chances": "Medium",
                "time": { "en": "7-10 days", "gu": "૭-૧૦ દિવસ", "hi": "७-१० दिन" },
                "unrecoverable_signs": {
                    "en": "If over 50% of bolls have exit holes and show inside rot.",
                    "gu": "જો ૫૦% થી વધુ ઝીંડવામાં છિદ્રો હોય અને અંદર સડો થઈ ગયો હોય.",
                    "hi": "यदि ५०% से अधिक डोडो में छेद हो और अंदर सड़न हो।"
                }
            }
        },
        "nutrient": {
            "name": {
                "en": "Magnesium / Nitrogen Deficiency (Lalio)",
                "gu": "લાલીયો / નાઇટ્રોજન અને મેગ્નેશિયમની ખામી",
                "hi": "लालिया रोग / नाइट्रोजन और मैग्नीशियम की कमी"
            },
            "explanation": {
                "en": "Nutritional imbalance causing leaves to turn yellow or red and stunt growth.",
                "gu": "જમીનમાં પોષક તત્વોની ઉણપ જેના કારણે પાંદડા લાલ કે પીળા પડે છે.",
                "hi": "पोषक तत्वों की कमी जिससे पत्तियां लाल या पीली पड़ जाती हैं और विकास रुकता है।"
            },
            "severity": "Green",
            "recovery": {
                "chances": "High",
                "time": { "en": "5-7 days", "gu": "૫-૭ દિવસ", "hi": "५-७ दिन" },
                "unrecoverable_signs": {
                    "en": "If the soil is heavily saline and leaves dry up completely.",
                    "gu": "જો જમીન વધારે ક્ષારવાળી હોય અને પાંદડા સંપૂર્ણ સુકાઈ જાય.",
                    "hi": "यदि मिट्टी अत्यधिक खारी हो और पत्तियां पूरी तरह सूख जाएं।"
                }
            }
        }
    },
    "groundnut": {
        "fungal": {
            "name": {
                "en": "Tikka Leaf Spot / Collar Rot",
                "gu": "ટીક્કા રોગ (પાનના ટપકાં) / કોલર રોટ",
                "hi": "टिक्का रोग (पत्ती धब्बा) / कॉलर रॉट"
            },
            "explanation": {
                "en": "Fungal infection causing circular brown spots with yellow halos and stem rotting.",
                "gu": "એક ફૂગજન્ય ચેપ જેનાથી પાંદડા પર ગોળાકાર ટપકાં અને થડ પાસે સડો થાય છે.",
                "hi": "फंगल संक्रमण जिससे पत्तियों पर गोलाकार धब्बे और तने के पास सड़न होती है।"
            },
            "severity": "Yellow",
            "recovery": {
                "chances": "High",
                "time": { "en": "7-10 days", "gu": "૭-૧૦ દિવસ", "hi": "७-१० दिन" },
                "unrecoverable_signs": {
                    "en": "If root rot causes plant collapse and black mold at collar region.",
                    "gu": "જો કોલર વિસ્તારમાં કાળી ફૂગ થાય અને આખો છોડ ઢળી પડે.",
                    "hi": "यदि कॉलर क्षेत्र में काली कवक हो और पूरा पौधा मुरझाकर गिर जाए।"
                }
            }
        },
        "bacterial": {
            "name": {
                "en": "Bacterial Wilt",
                "gu": "બેક્ટેરિયલ સુકારો",
                "hi": "जीवाणु मुरझान"
            },
            "explanation": {
                "en": "Bacterial disease causing sudden wilting of plants without leaf yellowing.",
                "gu": "જીવાણુ રોગ જેના કારણે પાંદડા પીળા પડ્યા વગર છોડ અચાનક સુકાઈ જાય છે.",
                "hi": "जीवाणु रोग जिसके कारण बिना पत्तियां पीली पड़े पौधा अचानक सूख जाता है।"
            },
            "severity": "Red",
            "recovery": {
                "chances": "Medium",
                "time": { "en": "10-12 days", "gu": "૧૦-૧૨ દિવસ", "hi": "१०-१२ दिन" },
                "unrecoverable_signs": {
                    "en": "If plant roots ooze slimy white liquid when squeezed.",
                    "gu": "જો મૂળને દબાવતા તેમાંથી સફેદ ચીકણો પદાર્થ નીકળે.",
                    "hi": "यदि जड़ों को दबाने पर सफेद चिपचिपा पदार्थ निकले।"
                }
            }
        },
        "viral": {
            "name": {
                "en": "Peanut Mottle / Bud Necrosis Virus",
                "gu": "પીનટ મોટલ / કળી સુકારો વાયરસ",
                "hi": "मूंगफली मोटल / कली नेक्रोसिस वायरस"
            },
            "explanation": {
                "en": "Viral disease causing mottled leaves and necrotic rings on young buds.",
                "gu": "વાયરસજન્ય રોગ જેનાથી કળીઓ સુકાઈ જાય છે અને પાંદડા પર મોઝેક ડાઘ દેખાય છે.",
                "hi": "वायरस जनित रोग जिससे पत्तियां चितकबरी हो जाती हैं और कलियां सूख जाती हैं।"
            },
            "severity": "Red",
            "recovery": {
                "chances": "Low",
                "time": { "en": "15-20 days", "gu": "૧૫-૨૦ દિવસ", "hi": "१५-२० दिन" },
                "unrecoverable_signs": {
                    "en": "If growing buds dry up completely and plant turns brown.",
                    "gu": "જો વધતી જતી કળીઓ સંપૂર્ણ સુકાઈ જાય અને છોડ કથ્થઈ રંગનો થાય.",
                    "hi": "यदि बढ़ती कलियां पूरी तरह सूख जाएं और पौधा भूरा हो जाए।"
                }
            }
        },
        "pest": {
            "name": {
                "en": "Leaf Miner / Aphids infestation",
                "gu": "પાન કોરી ખાનાર ઈયળ / મોલો-મશી",
                "hi": "पत्ती सुरंगक / चेपा कीट का हमला"
            },
            "explanation": {
                "en": "Insects mining the leaves or sucking sap, causing dry leaves and sticky residue.",
                "gu": "જીવાતો પાંદડા કોરી ખાય છે અથવા રસ ચૂસે છે, જેથી પાન સુકાઈ જાય છે.",
                "hi": "कीट पत्तियों में सुरंग बनाते हैं या रस चूसते हैं, जिससे पत्तियां सूखती हैं।"
            },
            "severity": "Yellow",
            "recovery": {
                "chances": "High",
                "time": { "en": "5-7 days", "gu": "૫-૭ દિવસ", "hi": "५-७ दिन" },
                "unrecoverable_signs": {
                    "en": "If more than 70% leaves are mined and dry up completely.",
                    "gu": "જો ૭૦% થી વધુ પાંદડા કોરાઈ ગયા હોય અને સુકાઈ જાય.",
                    "hi": "यदि ७०% से अधिक पत्तियां सूखकर नष्ट हो जाएं।"
                }
            }
        },
        "nutrient": {
            "name": {
                "en": "Iron / Zinc Deficiency",
                "gu": "લોહ અને જસતની ખામી",
                "hi": "लोहा और जस्ता की कमी"
            },
            "explanation": {
                "en": "Nutritional deficiency leading to yellowing of top leaves while veins remain green.",
                "gu": "પોષક તત્વોની ઉણપથી ટોચના પાંદડા પીળા પડે છે પણ નસો લીલી રહે છે.",
                "hi": "पोषक तत्वों की कमी जिससे शीर्ष पत्तियां पीली पड़ती हैं लेकिन नसें हरी रहती हैं।"
            },
            "severity": "Green",
            "recovery": {
                "chances": "High",
                "time": { "en": "5-7 days", "gu": "૫-૭ દિવસ", "hi": "५-૭ दिन" },
                "unrecoverable_signs": {
                    "en": "If leaves turn bleached white and start falling off.",
                    "gu": "જો પાંદડા સાવ સફેદ થઈને ખરવા લાગે.",
                    "hi": "यदि पत्तियां बिल्कुल सफेद होकर झड़ने लगें।"
                }
            }
        }
    },
    "wheat": {
        "fungal": {
            "name": {
                "en": "Rust Disease (Brown/Yellow) / Loose Smut",
                "gu": "ગેરુ રોગ (ભૂરો/પીળો) / છૂટો અંગારિયો",
                "hi": "रतुआ रोग (भूरा/पीला) / लूज स्मट"
            },
            "explanation": {
                "en": "Severe fungal disease forming yellow or orange pustules on leaves or black powdery ears.",
                "gu": "પાંદડા પર નારંગી ટપકાં અથવા ઉંબીમાં કાળો પાવડર ઉત્પન્ન કરતો ફૂગનો રોગ.",
                "hi": "पत्तियों पर नारंगी फफोले या बालियों में काला पाउडर बनाने वाला कवक रोग।"
            },
            "severity": "Red"
        },
        "pest": {
            "name": {
                "en": "Wheat Aphids / Armyworm attack",
                "gu": "મોલો-મશી / લશ્કરી ઈયળનો ઉપદ્રવ",
                "hi": "गेहूं के चेपा (माहू) / सैनिक कीट का हमला"
            },
            "explanation": {
                "en": "Insects sucking sap from leaves and ears, or chewing foliage overnight.",
                "gu": "જીવાતો પાંદડા અને ઉંબીમાંથી રસ ચૂસે છે અથવા પાંદડા કોરી ખાય છે.",
                "hi": "कीट पत्तियों और बालियों से रस चूसते हैं या पत्तियों को रात भर में खा जाते हैं।"
            },
            "severity": "Yellow"
        },
        "nutrient": {
            "name": {
                "en": "Nitrogen / Zinc Deficiency",
                "gu": "નાઇટ્રોજન અને જસતની ખામી",
                "hi": "नाइट्रोजन और जस्ता की कमी"
            },
            "explanation": {
                "en": "Nutrient deficiency causing overall yellowing of wheat leaves and stunted ears.",
                "gu": "પોષક તત્વોની ઉણપ જેના લીધે ઘઉંના પાન પીળા પડે છે અને ઉંબીઓ નાની રહે છે.",
                "hi": "पोषक तत्वों की कमी जिससे पत्तियां पीली पड़ती हैं और बालियों का विकास रुक जाता है।"
            },
            "severity": "Green"
        }
    },
    "rice": {
        "fungal": {
            "name": {
                "en": "Rice Blast / Brown Spot",
                "gu": "ડાંગરનો બ્લાસ્ટ (કરમો) / ભૂરા ટપકાં",
                "hi": "धान का ब्लास्ट / भूरा पत्ती धब्बा"
            },
            "explanation": {
                "en": "Fungal infection causing spindle-shaped spots on leaves and neck rot in ears.",
                "gu": "એક ફૂગજન્ય રોગ જેના લીધે પાંદડા પર ત્રાકાકાર ડાઘ અને ઉંબી નીચે સડો થાય છે.",
                "hi": "फंगल रोग जिससे पत्तियों पर नाव के आकार के धब्बे और बालियों के पास सड़न होती है।"
            },
            "severity": "Red"
        },
        "bacterial": {
            "name": {
                "en": "Bacterial Leaf Blight (BLB)",
                "gu": "બેક્ટેરિયલ પર્ણ સુકારો",
                "hi": "जीवाणु जनित पत्ती झुलसा"
            },
            "explanation": {
                "en": "Bacterial disease causing straw-colored wavy streaks starting from leaf tips.",
                "gu": "બેક્ટેરિયાથી થતો રોગ જેના કારણે પાંદડાની ટોચથી પીળી પટ્ટીઓ શરૂ થાય છે.",
                "hi": "जीवाणु रोग जिससे पत्ती की नोक से शुरू होकर पीले-भूरे रंग की धारियां बनती हैं।"
            },
            "severity": "Red"
        },
        "viral": {
            "name": {
                "en": "Rice Tungro Virus",
                "gu": "ડાંગરનો ટુંગરો વાયરસ",
                "hi": "धान का टुंग्रो वायरस"
            },
            "explanation": {
                "en": "Viral disease spread by green leafhoppers, causing stunting and orange leaves.",
                "gu": "લીલા તડતડિયાથી ફેલાતો રોગ જે છોડને નાનો રાખે છે અને પાન નારંગી બને છે.",
                "hi": "हरे फुदकों द्वारा फैलने वाला वायरस जिससे पौधे बौने रह जाते हैं और पत्तियां नारंगी होती हैं।"
            },
            "severity": "Red"
        },
        "pest": {
            "name": {
                "en": "Yellow Stem Borer / Leaf Folder",
                "gu": "ગાભમારાની ઈયળ / પાન વાળનારી ઈયળ",
                "hi": "पीला तना छेदक / पत्ती लपेटक कीट"
            },
            "explanation": {
                "en": "Insect pests boring into the stem (dead heart) or folding and feeding inside leaves.",
                "gu": "જીવાતો થડ કોરી ખાય છે (જેનાથી પીળો સુકારો થાય) અથવા પાંદડા વાળીને નુકસાન કરે છે.",
                "hi": "कीट तने के अंदर छेद करते हैं (जिससे सूखी बाली बनती है) या पत्तियों को लपेटकर खाते हैं।"
            },
            "severity": "Red"
        },
        "nutrient": {
            "name": {
                "en": "Zinc Deficiency (Khaira Disease)",
                "gu": "જસતની ઉણપ (ખૈરા રોગ)",
                "hi": "जस्ता की कमी (खैरा रोग)"
            },
            "explanation": {
                "en": "Nutritional deficiency leading to rusty-brown coloration on lower leaves.",
                "gu": "જસતની ઉણપને કારણે નીચેના પાંદડા કથ્થઈ-લાલ રંગના દેખાવા લાગે છે.",
                "hi": "जस्ता की कमी जिससे निचली पत्तियों पर जंग जैसे कत्थई रंग के धब्बे बनते हैं।"
            },
            "severity": "Yellow"
        }
    },
    "cumin": {
        "fungal": {
            "name": {
                "en": "Alternaria Blight / Powdery Mildew / Wilt",
                "gu": "કાળિયો રોગ (સુકારો) / છારો",
                "hi": "झुलसा रोग / छाछिया रोग / उकठा"
            },
            "explanation": {
                "en": "Most destructive cumin diseases causing plant blackening, white coating, or sudden wilting.",
                "gu": "જીરુંનો સૌથી ઘાતક રોગ જેનાથી છોડ કાળો પડી જાય છે, ચામડી પર સફેદ પાવડર થાય કે સુકાઈ જાય છે.",
                "hi": "जीरे के सबसे हानिकारक रोग जिससे पौधे काले पड़ जाते हैं, सफ़ेद परत जमती है या सूख जाते हैं।"
            },
            "severity": "Red",
            "recovery": {
                "chances": "Medium",
                "time": { "en": "10-14 days", "gu": "૧૦-૧૪ દિવસ", "hi": "१०-१४ दिन" },
                "unrecoverable_signs": {
                    "en": "If wilt symptoms spread to more than 40% of cumin plants.",
                    "gu": "જો સુકારાના લક્ષણો ૪૦% થી વધુ જીરાના છોડમાં ફેલાઈ જાય.",
                    "hi": "यदि उकठा (सूखा) के लक्षण ४०% से अधिक जीरे के पौधों में फैल जाएं।"
                }
            }
        },
        "pest": {
            "name": {
                "en": "Aphids attack",
                "gu": "મોલો-મશીનો ભારે ઉપદ્રવ",
                "hi": "चेपा (माहू) कीट का प्रकोप"
            },
            "explanation": {
                "en": "Sucking pests attacking flowers and developing seeds, causing sticky liquid coating.",
                "gu": "ચૂસિયા જીવાતો જે ફૂલો અને બીજનો રસ ચૂસે છે અને છોડને ચીકણો બનાવે છે.",
                "hi": "चूसक कीट जो फूलों और बनते बीजों का रस चूसते हैं और चिपचिपा तरल छोड़ते हैं।"
            },
            "severity": "Red"
        }
    },
    "tomato": {
        "fungal": {
            "name": {
                "en": "Early Blight / Leaf Spot",
                "gu": "વહેલો સુકારો / પાનના ટપકાં",
                "hi": "अगेती झुलसा / पत्ती धब्बा"
            },
            "explanation": {
                "en": "Fungal disease leading to concentric dark spots on older leaves.",
                "gu": "એક ફૂગનો રોગ જેના કારણે જૂના પાંદડા પર ગોળાકાર કાળા ડાઘ થાય છે.",
                "hi": "फंगल रोग जिससे पुरानी पत्तियों पर गोल चक्राकार काले धब्बे बनते हैं।"
            },
            "severity": "Yellow"
        },
        "bacterial": {
            "name": {
                "en": "Bacterial Wilt",
                "gu": "બેક્ટેરિયલ સુકારો",
                "hi": "जीवाणु मुरझान"
            },
            "explanation": {
                "en": "Bacterial infection leading to rapid wilting of plant while leaves remain green.",
                "gu": "બેક્ટેરિયાનો ચેપ જે છોડને લીલા પાંદડા હોવા છતાં ઝડપથી સુકવી નાખે છે.",
                "hi": "जीवाणु संक्रमण जिससे पत्तियों के हरे रहने पर भी पौधा अचानक सूख जाता है।"
            },
            "severity": "Red"
        },
        "viral": {
            "name": {
                "en": "Tomato Leaf Curl Virus (ToLCV)",
                "gu": "ટામેટાનો પર્ણ કોકડવાળ વાયરસ",
                "hi": "टमाटर का पर्ण कुंचन वायरस"
            },
            "explanation": {
                "en": "Viral disease causing upward curling and yellowing of leaves and complete stunting.",
                "gu": "વાયરસ રોગ જેથી પાંદડા ઉપરની તરફ વળે છે અને છોડ વધતો નથી.",
                "hi": "वायरस रोग जिससे पत्तियां ऊपर मुड़कर पीली हो जाती हैं और विकास रुक जाता है।"
            },
            "severity": "Red"
        },
        "pest": {
            "name": {
                "en": "Fruit Borer infestation",
                "gu": "ફળ કોરી ખાનાર ઈયળ",
                "hi": "फल छेदक कीट का प्रकोप"
            },
            "explanation": {
                "en": "Larvae boring holes into tomato fruits, rendering them unfit for consumption.",
                "gu": "ઈયળો ટામેટાના ફળોમાં છિદ્રો કરે છે જેથી ફળ બગડી જાય છે.",
                "hi": "इल्लियां टमाटर के फलों में छेद करके उन्हें खाने और बेचने लायक नहीं छोड़तीं।"
            },
            "severity": "Red"
        },
        "nutrient": {
            "name": {
                "en": "Calcium Deficiency (Blossom End Rot)",
                "gu": "કેલ્શિયમની ખામી (ફળનો પાછળનો સડો)",
                "hi": "कैल्शियम की कमी (ब्लॉसम एंड रॉट)"
            },
            "explanation": {
                "en": "Lack of calcium leading to black leathery spots at the bottom of tomato fruits.",
                "gu": "કેલ્શિયમની ઉણપને કારણે ટામેટાના ફળની નીચેનો ભાગ કાળો અને કઠણ થઈ સડી જાય છે.",
                "hi": "कैल्शियम की कमी जिससे टमाटर के फलों का निचला हिस्सा काला होकर सड़ जाता है।"
            },
            "severity": "Yellow"
        }
    },
    "potato": {
        "fungal": {
            "name": {
                "en": "Late Blight / Early Blight",
                "gu": "પાછલો સુકારો / વહેલો સુકારો",
                "hi": "पछेती झुलसा / अगेती झुलसा"
            },
            "explanation": {
                "en": "Fungal diseases causing water-soaked spots, white mold on leaves, and tuber rot.",
                "gu": "ફૂગજન્ય રોગ જેનાથી પાન પર પાણીવાળા જખમ, સફેદ ફૂગ અને બટાટામાં સડો થાય છે.",
                "hi": "कवक रोग जिससे पत्तों पर धब्बे, सफ़ेद फफूंद और आलू के कंदों में सड़न होती है।"
            },
            "severity": "Red"
        },
        "bacterial": {
            "name": {
                "en": "Common Scab / Bacterial Wilt",
                "gu": "બટાટાના ભીંગડા (સ્કેબ) / બેક્ટેરિયલ સુકારો",
                "hi": "साधारण पपड़ी (स्कैब) / जीवाणु मुरझान"
            },
            "explanation": {
                "en": "Bacterial diseases causing corky lesions on tubers or sudden plant wilting.",
                "gu": "જીવાણુ રોગ જે બટાટાની ચામડી પર ખરબચડા ચાંદા અથવા સુકારો પેદા કરે છે.",
                "hi": "जीवाणु रोग जो आलू की त्वचा पर खुरदरी पपड़ी बनाते हैं या पौधा सुखा देते हैं।"
            },
            "severity": "Red"
        },
        "pest": {
            "name": {
                "en": "Potato Tuber Moth / Aphids",
                "gu": "બટાટાની કીડીઓ અને મોલો-મશી",
                "hi": "आलू कंद पतंगा / चेपा कीट"
            },
            "explanation": {
                "en": "Larvae boring tunnels into tubers in field and storage, or vectors sucking leaf sap.",
                "gu": "ઈયળો જમીનમાં અને કોલ્ડ સ્ટોરેજમાં બટાટા કોરી ખાય છે.",
                "hi": "इल्लियां खेत और गोदाम में आलू के कंदों में सुरंग बनाती हैं।"
            },
            "severity": "Red"
        }
    },
    "chilli": {
        "fungal": {
            "name": {
                "en": "Anthracnose / Fruit Rot",
                "gu": "ચોળિયા રોગ / ફળનો સડો",
                "hi": "एन्थ्रेक्नोज / फल सड़न रोग"
            },
            "explanation": {
                "en": "Fungal disease causing circular sunken spots on chilli pods and dieback of stems.",
                "gu": "એક ફૂગ રોગ જે મરચાના ફળ પર બેઠેલા ડાઘા અને ડાળીઓ ટોચથી સુકવી નાખે છે.",
                "hi": "फंगल रोग जिससे मिर्च के फलों पर धब्बे बनते हैं और टहनियां ऊपर से सूखती हैं।"
            },
            "severity": "Yellow"
        },
        "viral": {
            "name": {
                "en": "Chilli Leaf Curl Virus",
                "gu": "મરચીનો કોકડવાળ વાયરસ",
                "hi": "मिर्च का पर्ण कुंचन वायरस"
            },
            "explanation": {
                "en": "Viral infection spread by thrips/whitefly, causing severe leaf curling and stunting.",
                "gu": "જીવાતોથી ફેલાતો વાયરસ જેના કારણે મરચીના પાંદડા સાવ કોકડાઈ જાય છે.",
                "hi": "कीटों द्वारा फैलने वाला वायरस जिससे मिर्च के पत्ते मुड़कर सिकुड़ जाते हैं।"
            },
            "severity": "Red"
        },
        "pest": {
            "name": {
                "en": "Thrips / Mites attack",
                "gu": "થ્રીપ્સ અને પાન કથીરીનો ભારે ઉપદ્રવ",
                "hi": "थ्रिप्स और मकड़ी (माइट्स) का हमला"
            },
            "explanation": {
                "en": "Tiny insects feeding on leaf sap, causing boat-shaped leaf upward curling.",
                "gu": "ઝીણી જીવાતો પાંદડામાંથી રસ ચૂસે છે જેથી પાન હોડી આકારમાં વળી જાય છે.",
                "hi": "बारीक कीट पत्तों का रस चूसते हैं जिससे पत्ते नाव के आकार में मुड़ जाते हैं।"
            },
            "severity": "Red"
        }
    }
};

// Map spelling variants
customDiseases["onion_v"] = customDiseases["onion"];
customDiseases["garlic_v"] = customDiseases["garlic"];
customDiseases["chilli_v"] = customDiseases["chilli"];
customDiseases["cluster_bean_v"] = customDiseases["cluster_bean"];
customDiseases["cowpea_v"] = customDiseases["cowpea"];

const treatments = {
    "fungal": {
        "organic": {
            "en": [
                "Step 1: Preparation (Mix 500ml sour buttermilk or whey with 10 liters of water)",
                "Step 2: Application (Spray the mixture thoroughly on leaves early morning or late evening)",
                "Step 3: Prevention/Take Care (Remove infected lower leaves and bury them in the soil to prevent spread)"
            ],
            "hi": [
                "चरण 1: तैयारी (५०० मिली खट्टी छाछ या मट्ठा को १० लीटर पानी में मिलाएं)",
                "चरण 2: छिड़काव (इस मिश्रण का सुबह या शाम को पत्तों पर अच्छी तरह छिड़काव करें)",
                "चरण 3: रोकथाम (संक्रमित निचले पत्तों को तोड़कर जमीन में गाड़ दें ताकि फैलाव रुके)"
            ],
            "gu": [
                "પગલું 1: તૈયારી (ખાટી છાશ અથવા વ્હે ૫૦૦ મિલી ૧૦ લીટર પાણીમાં મેળવો)",
                "પગલું 2: છંટકાવ (આ મિશ્રણ સવારે અથવા સાંજે પાંદડા પર બરાબર છાંટો)",
                "પગલું 3: અટકાવ (ચેપગ્રસ્ત નીચેના પાંદડા તોડીને જમીનમાં દાટો જેથી રોગ ન ફેલાય)"
            ]
        },
        "chemical": {
            "en": [
                "Emergency Chemical: Spray Copper Oxychloride (2g/L) or Mancozeb (2.5g/L) immediately.",
                "Safety Rule: Wear a face mask and protective gloves; spray only in wind direction."
            ],
            "hi": [
                "आपातकालीन रासायनिक: कॉपर ऑक्सीक्लोराइड (२ ग्राम/लीटर) या मैंकोजेब (२.૫ ग्राम/लीटर) छिड़कें।",
                "सुरक्षा नियम: चेहरे पर मास्क और दस्ताने पहनें; हवा की दिशा में ही छिड़काव करें।"
            ],
            "gu": [
                "ઇમરજન્સી કેમિકલ: કોપર ઓક્સિક્લોરાઇડ (૨ ગ્રામ/લીટર) અથવા મેન્કોઝેબ (૨.૫ ગ્રામ/લીટર) છાંટો.",
                "સુરક્ષા નિયમ: મોં પર માસ્ક અને ગ્લોવ્ઝ પહેરો; પવનની દિશામાં જ છંટકાવ કરો."
            ]
        },
        "prevention": {
            "en": [
                "Use Trichoderma viride bio-fungicide during sowing/planting.",
                "Maintain proper spacing between plants and avoid water stagnation in fields.",
                "Adopt 2-3 years crop rotation with non-host crops."
            ],
            "hi": [
                "बुवाई/रोपण के समय ट्राइकोडेर्मा विरिडी जैविक कवकनाशी का प्रयोग करें।",
                "पौधों के बीच उचित दूरी बनाए रखें और खेत में जलभराव न होने दें।",
                "गैर-मेजबान फसलों के साथ २-३ साल का फसल चक्र अपनाएं।"
            ],
            "gu": [
                "વાવણી વખતે ટ્રાઇકોડર્મા વિરીડી જૈવિક ફૂગનાશકનો ઉપયોગ કરો.",
                "છોડ વચ્ચે યોગ્ય અંતર રાખો અને ખેતરમાં પાણી ભરાવા ન દો.",
                "અન્ય પાકો સાથે ૨-૩ વર્ષની પાક ફેરબદલી પદ્ધતિ અપનાવો."
            ]
        }
    },
    "viral": {
        "organic": {
            "en": [
                "Step 1: Preparation (Mix 5ml Neem oil and 2ml liquid soap in 1 liter of warm water)",
                "Step 2: Application (Spray on the entire plant to control vectors carrying the virus)",
                "Step 3: Prevention/Take Care (Uproot and burn severely infected plants immediately to save the field)"
            ],
            "hi": [
                "चरण 1: तैयारी (१ लीटर गुनगुने पानी में ५ मिली नीम का तेल और २ मिली लिक्विड सोप मिलाएं)",
                "चरण 2: उपयोग (वायरस फैलाने वाले चूसक कीटों को नियंत्रित करने के लिए पूरे पौधे पर छिड़कें)",
                "चरण 3: रोकथाम (गंभीर रूप से संक्रमित पौधों को जड़ से उखाड़कर तुरंत जला दें)"
            ],
            "gu": [
                "પગલું 1: તૈયારી (લીમડાનું તેલ ૫ મિલી અને સાબુનું પ્રવાહી ૨ મિલી ૧ લીટર નવશેકા પાણીમાં મેળવો)",
                "પગલું 2: ઉપયોગ (વાયરસ ફેલાવતી જીવાતને નિયંત્રિત કરવા આખા છોડ પર છાંટો)",
                "પગલું 3: અટકાવ (ચેપગ્રસ્ત છોડને મૂળમાંથી ઉખાડીને તરત જ સળગાવી દો)"
            ]
        },
        "chemical": {
            "en": [
                "Emergency Chemical: Spray Imidacloprid (0.5ml/L) or Acetamiprid (0.5g/L) to control sucking vectors.",
                "Safety Rule: Avoid spraying during peak flowering period to protect pollinating bees."
            ],
            "hi": [
                "आपातकालीन रासायनिक: चूसक कीटों के लिए इमिडाक्लोप्रिड (०.५ मिली/ली) या एसिटामिप्रिड (०.५ ग्राम/ली) छिड़कें।",
                "सुरक्षा नियम: परागण करने वाले कीटों के बचाव के लिए फूल आने के समय छिड़काव से बचें।"
            ],
            "gu": [
                "ઇમરજન્સી કેમિકલ: ચૂસિયા જીવાતો માટે ઈમીડાક્લોપ્રીડ (૦.૫ મિલી) અથવા એસીટામીપ્રીડ (૦.૫ ગ્રામ/લીટર) છાંટો.",
                "સુરક્ષા નિયમ: પરાગનયન કરતી મધમાખીઓના બચાવ માટે ફૂલ આવવાના સમયે છંટકાવ ટાળો."
            ]
        },
        "prevention": {
            "en": [
                "Install yellow/blue sticky traps (10-15 traps per acre) to capture insect vectors.",
                "Grow virus-resistant seed varieties recommended by local agriculture department.",
                "Keep field borders clean and remove weed hosts that harbor virus vectors."
            ],
            "hi": [
                "कीटों को पकड़ने के लिए खेत में पीले/नीले चिपचिपे जाल (प्रति एकड़ १०-१५) लगाएं।",
                "स्थानीय कृषि विभाग द्वारा अनुशंसित वायरस-प्रतिरोधी बीज किस्मों की बुवाई करें।",
                "खेत की मेड़ों को साफ रखें और वायरस फैलाने वाले कीटों को आश्रय देने वाले खरपतवारों को हटा दें।"
            ],
            "gu": [
                "વાહક જીવાતોને પકડવા ખેતરમાં પીળા/વાદળી ચીકણા પાંજરા (૧૦-૧૫ નંગ પ્રતિ એકર) ગોઠવો.",
                "સ્થानीय કૃષિ વિભાગ દ્વારા પ્રમાણિત કરેલ રોગપ્રતિકારક જાતો વાવો.",
                "ખેતરની શેઢા-પાળ સાફ રાખો અને વાયરસ ફેલાવતી નકામી વનસ્પતિનો નાશ કરો."
            ]
        }
    },
    "bacterial": {
        "organic": {
            "en": [
                "Step 1: Preparation (Dissolve 1kg fresh cow dung and 1 liter cow urine in 10 liters of water)",
                "Step 2: Application (Filter the mixture thoroughly using double-layered cloth and spray on plants)",
                "Step 3: Prevention/Take Care (Avoid handling or pruning plants when they are wet to prevent bacteria spread)"
            ],
            "hi": [
                "चरण 1: तैयारी (१ किलो ताजा गाय का गोबर और १ लीटर गोमूत्र को १० लीटर पानी में घोलें)",
                "चरण 2: उपयोग (मिश्रण को दोहरे कपड़े से अच्छी तरह छान लें और दोपहर के बाद पौधों पर छिड़कें)",
                "चरण 3: रोकथाम (बैक्टीरिया के फैलाव को रोकने के लिए पौधों के गीले होने पर कटाई-छंटाई न करें)"
            ],
            "gu": [
                "પગલું 1: તૈયારી (૧ કિલો તાજું ગાયનું છાણ અને ૧ લીટર ગૌમૂત્ર ૧૦ લીટર પાણીમાં ઓગાળો)",
                "પગલું 2: ઉપયોગ (મિશ્રણને બેવડા કપડાથી બરાબર ગાળી લો અને છોડ પર છાંટો)",
                "પગલું 3: અટકાવ (જિયારે છોડ ભીના હોય ત્યારે કાપણી કે કોઈ માવજત ન કરવી જેથી રોગ ન ફેલાય)"
            ]
        },
        "chemical": {
            "en": [
                "Emergency Chemical: Spray Streptocycline (1g in 10L water) mixed with Copper Oxychloride (20g).",
                "Safety Rule: Maintain a safety gap of 15 days between spraying and harvesting."
            ],
            "hi": [
                "आपातकालीन रासायनिक: स्ट्रेप्टोसाइक्लिन (१ ग्राम) और कॉपर ऑक्सीक्लोराइड (२० ग्राम) १० लीटर पानी में मिलाकर छिड़कें।",
                "सुरक्षा नियम: रासायनिक छिड़काव और फसल कटाई के बीच कम से कम १५ दिनों का अंतर रखें।"
            ],
            "gu": [
                "ઇમરજન્સી કેમિકલ: ૧૦ લીટર પાણીમાં સ્ટ્રેપ્ટોસાયક્લીન (૧ ગ્રામ) અને કોપર ઓક્સિક્લોરાઇડ (૨૦ ગ્રામ) મેળવી છાંટો.",
                "સુરક્ષા નિયમ: છંટકાવ અને લણણી વચ્ચે ઓછામાં ઓછો ૧૫ દિવસનો ગાળો રાખો."
            ]
        },
        "prevention": {
            "en": [
                "Treat seeds with Streptocycline (0.1g/L) or hot water before sowing.",
                "Regularly sanitize agricultural tools with a bleaching powder solution.",
                "Avoid excessive nitrogenous fertilizer application which favors bacterial growth."
            ],
            "hi": [
                "बुवाई से पहले बीजों को स्ट्रेप्टोसाइक्लिन (०.१ ग्राम/लीटर) या गर्म पानी से उपचारित करें।",
                "कृषि उपकरणों को नियमित रूप से ब्लीचिंग पाउडर के घोल से जीवाणुहीन करें।",
                "नाइट्रोजन युक्त खादों का अत्यधिक प्रयोग न करें, क्योंकि इससे बैक्टीरिया बढ़ते हैं।"
            ],
            "gu": [
                "વાવણી પહેલા બીજને સ્ટ્રેપ્ટોસાયક્લીન (૦.૧ ગ્રામ/લીટર) અથવા ગરમ પાણીનો પટ આપો.",
                "ખેતીના ઓજારોને નિયમિત રીતે બ્લીચિંગ પાવડરના પાણીથી સાફ કરો.",
                "નાઇટ્રોજનયુક્ત ખાતરોનો વધુ પડતો ઉપયોગ ટાળો કારણ કે તે બેક્ટેરિયા વધારે છે."
            ]
        }
    },
    "pest": {
        "organic": {
            "en": [
                "Step 1: Preparation (Soak 500g neem seed kernel powder in 10 liters of water overnight to make NSKE 5%)",
                "Step 2: Application (Filter the NSKE extract and add 10ml liquid soap, spray thoroughly on affected parts)",
                "Step 3: Prevention/Take Care (Manually collect and destroy caterpillars, egg masses, and damaged leaves)"
            ],
            "hi": [
                "चरण 1: तैयारी (५०० ग्राम नीम की निंबोली के पाउडर को १० लीटर पानी में रात भर भिगोकर ५% NSKE बनाएं)",
                "चरण 2: उपयोग (अर्क को छानकर १० मिली लिक्विड सोप मिलाएं और प्रभावित भागों पर अच्छी तरह छिड़कें)",
                "चरण 3: रोकथाम (पत्तियों से इल्लियों और अंडों के समूह को हाथ से चुनकर नष्ट करें)"
            ],
            "gu": [
                "પગલું 1: તૈયારી (૫૦૦ ગ્રામ લીંબોળીના પાવડરને ૧૦ લીટર પાણીમાં રાતભર પલાળી અર્ક (NSKE ૫%) બનાવો)",
                "પગલું 2: ઉપયોગ (અર્કને ગાળીને ૧૦ મિલી પ્રવાહી સાબુ ઉમેરો, અને અસરગ્રસ્ત ભાગો પર છાંટો)",
                "પગલું 3: અટકાવ (ઈયળો અને ઈંડાના સમૂહને હાથથી વીણીને નાશ કરો)"
            ]
        },
        "chemical": {
            "en": [
                "Emergency Chemical: Spray Profenofos 50 EC (2ml/L) or Chlorpyriphos 20 EC (2ml/L) for larval infestation.",
                "Safety Rule: Always wear protective boots, masks, and never spray against wind direction."
            ],
            "hi": [
                "आपातकालीन रासायनिक: इल्लियों के लिए प्रोफेनोफॉस ५० ईसी (२ मिली/ली) या क्लोरपायरीफॉस २० ईसी (२ मिली/ली) छिड़कें।",
                "सुरक्षा नियम: हमेशा सुरक्षात्मक जूते और मास्क पहनें; हवा के विपरीत कभी छिड़काव न करें।"
            ],
            "gu": [
                "ઇમરજન્સી કેમિકલ: ઈયળોના ઉપદ્રવ માટે પ્રોફેનોફોસ ૫૦ ઇસી (૨ મિલી) અથવા ક્લોરપાયરીફોસ ૨૦ ઇસી (૨ મિલી/લીટર) છાંટો.",
                "સુરક્ષા નિયમ: હંમેશા બૂટ અને મોં પર માસ્ક પહેરો; ક્યારેય પવનની સામે દવા ન છાંટવી."
            ]
        },
        "prevention": {
            "en": [
                "Set up pheromone traps (5 per acre) to monitor and disrupt mating of pest moths.",
                "Adopt deep summer ploughing to expose hibernating pest pupae to sunlight and predators.",
                "Grow border crops like Castor, Maize or Marigold to distract pests from main crop."
            ],
            "hi": [
                "वयस्क पतंगों को पकड़ने और निगरानी के लिए फेरोमोन जाल (५ प्रति एकड़) लगाएं।",
                "सुप्त कीटों के शंखी (प्यूपा) को नष्ट करने के लिए गर्मियों में गहरी जुताई करें।",
                "कीटों को मुख्य फसल से भटकाने के लिए अरंडी, मक्का या गेंदा जैसी सीमावर्ती फसलें लगाएं।"
            ],
            "gu": [
                "જીવાતોની મોનિટરિંગ માટે ફેરોમોન ટ્રેપ (એકરમાં ૫) ગોઠવો.",
                "જમીનમાં સુષુપ્ત અવસ્થામાં રહેલી કોશેટોનો નાશ કરવા ઉનાળામાં ઊંડી ખેડ કરો.",
                "મુખ્ય પાકને બચાવવા માટે શેઢા પર મકાઈ, એરંડા કે ગલગોટાના છોડ વાવો."
            ]
        }
    },
    "nutrient": {
        "organic": {
            "en": [
                "Step 1: Preparation (Mix 10-15 kg well-composted organic manure or vermicompost with 1L cow urine)",
                "Step 2: Application (Apply to the soil around the root zone, followed by light watering)",
                "Step 3: Prevention/Take Care (Spray liquid bio-fertilizer or Jeevamrut on leaves to boost micronutrient absorption)"
            ],
            "hi": [
                "चरण 1: तैयारी (१०-१५ किलो अच्छी सड़ी गोबर खाद या केंचुआ खाद में १ लीटर गोमूत्र मिलाएं)",
                "चरण 2: उपयोग (इसे जड़ों के पास मिट्टी में डालें और हल्की सिंचाई करें)",
                "चरण 3: रोकथाम (पोषक तत्वों के अवशोषण को बढ़ाने के लिए पत्तों पर तरल जीवामृत का छिड़काव करें)"
            ],
            "gu": [
                "પગલું 1: તૈયારી (૧૦-૧૫ કિલો અળસિયાનું ખાતર અથવા દેશી સડેલું ખાતર ૧ લીટર ગૌમૂત્ર સાથે મેળવો)",
                "પગલું 2: ઉપયોગ (આ ખાતરને મૂળના વિસ્તારમાં આપો અને પાછળથી હળવું પિયત આપો)",
                "પગલું 3: અટકાવ (પર્ણ દ્વારા શોષણ વધારવા પાંદડા પર જીવામૃત અથવા પ્રવાહી ખાતરનો છંટકાવ કરો)"
            ]
        },
        "chemical": {
            "en": [
                "Emergency Chemical: Spray 1% Urea (10g/L) for Nitrogen, or Grade IV micronutrient mix (2g/L) for zinc/iron.",
                "Safety Rule: Apply fertilizers only in moist soil; avoid applying to completely dry soil."
            ],
            "hi": [
                "आपातकालीन रासायनिक: नाइट्रोजन के लिए १% यूरिया (१० ग्राम/ली) या सूक्ष्म पोषक तत्वों का मिश्रण (२ ग्राम/ली) छिड़कें।",
                "सुरक्षा नियम: खादों का प्रयोग केवल नम मिट्टी में करें; सूखी मिट्टी में डालने से बचें।"
            ],
            "gu": [
                "ઇમરજન્સી કેમિકલ: નાઇટ્રોજન માટે ૧% યુરિયા (૧૦ ગ્રામ) અથવા જસત/લોહ માટે માઇક્રોન્યુટ્રીયન્ટ મિશ્રણ (૨ ગ્રામ/લીટર) છાંટો.",
                "સુરક્ષા નિયમ: ખાતરો હંમેશા જમીનમાં ભેજ હોય ત્યારે જ આપો; સૂકી જમીનમાં આપવાનું ટાળો."
            ]
        },
        "prevention": {
            "en": [
                "Perform annual soil testing at local Krishi Vigyan Kendra (KVK) to apply targeted doses.",
                "Integrate green manure crops like Sunnhemp or Dhaincha and plough them back into soil.",
                "Maintain balanced fertilizer application (NPK ratio) instead of using only Urea."
            ],
            "hi": [
                "लक्षित खुराक देने के लिए स्थानीय कृषि विज्ञान केंद्र (KVK) से प्रतिवर्ष मिट्टी की जांच कराएं।",
                "हरी खाद वाली फसलों जैसे सनई या ढैंचा को उगाएं और उन्हें मिट्टी में पलट दें।",
                "केवल यूरिया का प्रयोग करने के बजाय संतुलित उर्वरक (NPK अनुपात) का प्रयोग करें।"
            ],
            "gu": [
                "જરૂરિયાત મુજબ ખાતર આપવા નજીકના કૃષિ વિજ્ઞાન કેન્દ્ર (KVK) પર દર વર્ષે જમીન ચકાસણી કરાવો.",
                "જમીન ફળદ્રુપ કરવા માટે શણ અથવા ધૈંચા જેવા લીલા ખાતરના પાકો વાવો અને જમીનમાં દબાવી દો.",
                "માત્ર યુરિયા વાપરવાના બદલે સપ્રમાણ ખાતર (NPK રેશિયો) આપવાની પદ્ધતિ અપનાવો."
            ]
        }
    }
};

const suggestions = {
    "fungal": {
        "fertilizer": {
            "en": "Avoid high Nitrogen. Apply Potassium to strengthen plant cell walls against fungal entry.",
            "hi": "नाइट्रोजन का अधिक प्रयोग न करें। कवक से सुरक्षा के लिए पोटाश युक्त खाद डालें।",
            "gu": "નાઇટ્રોજન ખાતર ઓછું કરો. ફૂગ સામે છોડની પ્રતિકાર શક્તિ વધારવા પોટાશ ખાતર આપો."
        },
        "irrigation": {
            "en": "Stop overhead sprinkler irrigation. Use drip or furrow irrigation to keep foliage dry.",
            "hi": "ऊपर से पानी का छिड़काव बंद करें। पत्तों को सूखा रखने के लिए ड्रिप या नाली सिंचाई अपनाएं।",
            "gu": "ફુવારા પદ્ધતિથી પિયત આપવાનું બંધ કરો. પાંદડા સૂકા રાખવા ટપક અથવા નીક પદ્ધતિ અપનાવો."
        },
        "weather": {
            "en": "High humidity and cloudy weather accelerate spore spread. Avoid pruning during rains.",
            "hi": "अधिक नमी और बादल छाए रहने से बीमारी तेजी से फैलती है। बारिश में कटाई-छंताई न करें।",
            "gu": "વધુ ભેજ અને વાદળછાયું વાતાવરણ રોગ ફેલાવે છે. વરસાદના સમયમાં કાપણી કરવાનું ટાળો."
        },
        "earlyWarning": {
            "en": "Watch for tiny circular brown spots or white powdery spots on lower leaves.",
            "hi": "निचली पत्तियों पर छोटे गोल भूरे या सफेद पाउडर जैसे धब्बों पर नजर रखें।",
            "gu": "નીચેના પાંદડા પર નાના ગોળ ભૂરા અથવા સફેદ પાવડર જેવા ડાઘા પર નજર રાખો."
        },
        "nearestAction": {
            "en": "Consult block agriculture officer or take sample to nearest university lab.",
            "hi": "प्रखंड कृषि अधिकारी से सलाह लें या पास की प्रयोगशाला में नमूना भेजें।",
            "gu": "તાલુકા કૃષિ અધિકારીની સલાહ લો અથવા નજીકની લેબોરેટરીમાં છોડનું સેમ્પલ મોકલો."
        }
    },
    "viral": {
        "fertilizer": {
            "en": "Apply balanced organic compost and vermicompost to boost natural plant immunity.",
            "hi": "पौधे की प्राकृतिक प्रतिरोधक क्षमता बढ़ाने के लिए संतुलित जैविक खाद और केंचुआ खाद डालें।",
            "gu": "છોડની રોગપ્રતિકારક શક્તિ વધારવા માટે સારું સેન્દ્રિય ખાતર અને અળસિયાનું ખાતર આપો."
        },
        "irrigation": {
            "en": "Provide regular moderate irrigation. Do not allow plant to undergo water stress.",
            "hi": "नियमित रूप से मध्यम सिंचाई करें। पौधे को पानी की कमी (तनाव) में न आने दें।",
            "gu": "નિયમિત અને મધ્યમ પિયત આપો. છોડને પાણીની ખેંચ ન પડવા દો."
        },
        "weather": {
            "en": "Hot and dry dry weather increases sucking pest populations. Spray neem preventively.",
            "hi": "गर्म और शुष्क मौसम में चूसक कीटों की संख्या बढ़ती है। बचाव के लिए पहले से नीम का छिड़काव करें।",
            "gu": "ગરમ અને સૂકું હવામાન ચૂસિયા જીવાતો વધારે છે. બચાવ માટે અગાઉથી જ લીમડાની દવાનો છંટકાવ કરો."
        },
        "earlyWarning": {
            "en": "Look for leaf yellowing, green-yellow mosaic patches, or small twisted leaves at top.",
            "hi": "पत्तियों का पीला पड़ना, हरे-पीले धब्बे, या शीर्ष पर मुड़ी हुई छोटी पत्तियां देखें।",
            "gu": "પાંદડા પીળા પડવા, લીલા-પીળા ચકતા દેખાવા, અથવા ટોચ પર વળેલા નાના પાંદડા દેખાવા."
        },
        "nearestAction": {
            "en": "Contact nearest Krishi Vigyan Kendra (KVK) scientist to confirm vector control steps.",
            "hi": "कीटों के नियंत्रण की पुष्टि के लिए निकटतम कृषि विज्ञान केंद्र (KVK) के वैज्ञानिक से संपर्क करें।",
            "gu": "વાહક જીવાતોના યોગ્ય નિયંત્રણ માટે નજીકના કૃષિ વિજ્ઞાન કેન્દ્ર (KVK) ના વૈજ્ઞાનિકનો સંપર્ક કરો."
        }
    },
    "bacterial": {
        "fertilizer": {
            "en": "Avoid excessive urea. Apply Phosphorus and Potassium to build plant resistance.",
            "hi": "यूरिया के अत्यधिक प्रयोग से बचें। पौधे की शक्ति के लिए फास्फोरस और पोटाश डालें।",
            "gu": "યુરિયાનો વધુ પડતો ઉપયોગ ટાળો. પ્રતિકાર શક્તિ વધારવા ફોસ્ફરસ અને પોટાશ આપો."
        },
        "irrigation": {
            "en": "Prevent water accumulation in the field. Improve drainage; do not irrigate in mid-day.",
            "hi": "खेत में पानी जमा न होने दें। जल निकासी में सुधार करें; दोपहर में सिंचाई न करें।",
            "gu": "ખેતરમાં પાણી ભરાઈ ન રહેવા દો. પાણીના નિકાલની વ્યવસ્થા કરો; બપોરે પિયત આપવું નહીં."
        },
        "weather": {
            "en": "Warm temp and high humidity cause bacteria to multiply fast. Avoid injury to plants during tools usage.",
            "hi": "गर्म तापमान और उच्च नमी में बैक्टीरिया तेजी से बढ़ते हैं। औजारों के उपयोग के समय पौधों को चोट न पहुँचाएँ।",
            "gu": "ગરમ અને ભેજવાળા વાતાવરણમાં બેક્ટેરિયા ઝડપથી વધે છે. ખેતીકામ વખતે છોડને ઈજા ન થવા દો."
        },
        "earlyWarning": {
            "en": "Watch for translucent water-soaked spots on leaves that turn brown or black later.",
            "hi": "पत्तियों पर पारभासी पानी से लथपथ धब्बों को देखें जो बाद में भूरे या काले हो जाते हैं।",
            "gu": "પાંદડા પર પાણીવાળા ડાઘા પર નજર રાખો જે પાછળથી કાળા અથવા કથ્થઈ થઈ જાય છે."
        },
        "nearestAction": {
            "en": "Report to local extension officer immediately to check if there is block-wide outbreak.",
            "hi": "ब्लॉक में बड़े पैमाने पर प्रकोप की जांच के लिए तुरंत स्थानीय कृषि विस्तार अधिकारी को सूचित करें।",
            "gu": "તાલુકામાં રોગચાળો ન ફેલાય તે માટે તરત જ સ્થાનિક કૃષિ અધિકારીને જાણ કરો."
        }
    },
    "pest": {
        "fertilizer": {
            "en": "Apply Neem cake in the soil to suppress soil-dwelling pest larvae and pupae.",
            "hi": "मिट्टी में रहने वाले कीटों के प्यूपा को दबाने के लिए मिट्टी में नीम की खली डालें।",
            "gu": "જમીનમાં રહેલી જીવાતોના કોશેટોનો નાશ કરવા પાયામાં લીંબોળીનો ખોળ આપો."
        },
        "irrigation": {
            "en": "Light sprinkler irrigation can help wash off mites and aphids from leaves.",
            "hi": "हल्की फव्वारा सिंचाई से पत्तों से जूं (माइट्स) और चेपा (एफिड्स) धुल सकते हैं।",
            "gu": "હળવું ફુવારા પિયત આપવાથી પાંદડા પરથી મોલો અને થ્રીપ્સ જેવી જીવાતો ધોવાઈ જાય છે."
        },
        "weather": {
            "en": "Dry spell and lack of rain trigger rapid multiplying of sucking pests. Monitor daily.",
            "hi": "सूखे और बारिश न होने से चूसक कीट तेजी से बढ़ते हैं। प्रतिदिन खेत की निगरानी करें।",
            "gu": "લાંબો સુકારો અને ઓછો વરસાદ ચૂસિયા જીવાતો વધારે છે. દરરોજ ખેતરની તપાસ કરો."
        },
        "earlyWarning": {
            "en": "Observe for tiny insect bugs on leaf undersides, webbing, or small holes in stems/bolls.",
            "hi": "पत्ती के निचले हिस्से पर छोटे कीड़ों, जालों, या तनों/डोडो में छोटे छेदों को देखें।",
            "gu": "પાંદડા પાછળ ઝીણી જીવાત, થડમાં છિદ્રો અથવા જાળા જોવા મળે તો સાવધ થાઓ."
        },
        "nearestAction": {
            "en": "Visit nearest Agricultural University extension counter or KVK with live pest specimens.",
            "hi": "जीवित कीट के नमूने के साथ निकटतम कृषि विश्वविद्यालय या KVK केंद्र पर जाएँ।",
            "gu": "નજીકની કૃષિ યુનિવર્સિટી અથવા KVK કેન્દ્ર પર જીવતા જીવડાના નમૂના સાથે મુલાકાત લો."
        }
    },
    "nutrient": {
        "fertilizer": {
            "en": "Apply balanced compost, zinc sulphate, ferrous sulphate as soil amendments.",
            "hi": "मिट्टी के सुधार के लिए संतुलित खाद, जिंक सल्फेट और फेरस सल्फेट का प्रयोग करें।",
            "gu": "જમીન સુધારણા માટે સેન્દ્રિય ખાતર, ઝીંક સલ્ફેટ અને ફેરસ સલ્ફેટ આપો."
        },
        "irrigation": {
            "en": "Maintain consistent moisture. Uneven watering restricts nutrient uptake from soil.",
            "hi": "नमी समान बनाए रखें। असमान सिंचाई से मिट्टी से पोषक तत्वों का अवशोषण प्रभावित होता है।",
            "gu": "જમીનમાં ભેજ જાળવી રાખો. અનિયમિત પિયત આપવાથી જમીનમાંથી પોષક તત્વોનું શોષણ ઘટે છે."
        },
        "weather": {
            "en": "Extreme cold or heavy rains can leach nutrients below the root zone. Supplement foliar spray.",
            "hi": "अत्यधिक ठंड या भारी बारिश से पोषक तत्व बह जाते हैं। पत्तों पर पोषक तत्वों का छिड़काव करें।",
            "gu": "વધારે ઠંડી કે ભારે વરસાદથી પોષક તત્વો ધોવાઈ જાય છે. પાંદડા પર પ્રવાહી ખાતર છાંટો."
        },
        "earlyWarning": {
            "en": "Look for general yellowing of older leaves, leaf edge drying, or purple spots on stems.",
            "hi": "पुरानी पत्तियों का पीला पड़ना, पत्ती के किनारों का सूखना, या तने पर बैंगनी धब्बे देखें।",
            "gu": "જૂના પાંદડા પીળા પડવા, કિનારીઓ સુકાવી અથવા છોડનો વિકાસ અટકી જવો."
        },
        "nearestAction": {
            "en": "Take soil and leaf samples to government soil testing laboratory for complete analysis.",
            "hi": "पूर्ण विश्लेषण के लिए सरकारी मिट्टी परीक्षण प्रयोगशाला में मिट्टी और पत्ती का नमूना ले जाएं।",
            "gu": "સંપૂર્ણ વિશ્લેષણ માટે સરકારી જમીન પ્રયોગશાળામાં જમીન અને પાંદડાનું સેમ્પલ મોકલો."
        }
    }
};

// Helper: classify symptom by ID/content
function getSymptomCategory(symptom) {
    const en = (symptom.en || '').toLowerCase();
    const id = (symptom.id || '').toLowerCase();
    
    // Check specific pathogen signs or category
    if (symptom.category === 'root' && (id.includes('rot') || en.includes('rot') || en.includes('decay'))) {
        return 'fungal';
    }
    
    // Pest-related keywords
    if (id.includes('larvae') || id.includes('borer') || id.includes('mealybug') || id.includes('aphid') || 
        id.includes('whitefly') || id.includes('pest') || id.includes('insect') || id.includes('worm') || 
        id.includes('caterpillar') || id.includes('bug') || id.includes('mite') || id.includes('thrip') ||
        en.includes('larvae') || en.includes('borer') || en.includes('caterpillar') || en.includes('chewed') ||
        en.includes('insect') || en.includes('aphid') || en.includes('whitefly') || en.includes('mealybug') ||
        en.includes('pest') || en.includes('honeydew') || en.includes('sooty mold') || en.includes('webbing') ||
        en.includes('hole') || en.includes('thrips') || en.includes('scale') || en.includes('gall') ||
        en.includes('locust') || en.includes('beetle') || en.includes('weevil') || en.includes('hopper') ||
        en.includes('jassid') || en.includes('armyworm') || en.includes('bollworm') || en.includes('grub') ||
        en.includes('miner') || en.includes('mite')) {
        return 'pest';
    }
    
    // Viral-related keywords
    if (id.includes('curl') || id.includes('mosaic') || id.includes('clearing') || id.includes('banding') || 
        id.includes('virus') || id.includes('mottling') || id.includes('dwarf') || id.includes('streak') ||
        en.includes('curl') || en.includes('mosaic') || en.includes('clearing') || en.includes('banding') ||
        en.includes('virus') || en.includes('mottling') || en.includes('dwarf') || en.includes('streak') ||
        en.includes('witches') || en.includes('enation') || en.includes('distortion')) {
        return 'viral';
    }
    
    // Bacterial-related keywords
    if (id.includes('bacterial') || id.includes('ooze') || id.includes('canker') || 
        en.includes('bacterial') || en.includes('ooze') || en.includes('canker') || en.includes('black rot') ||
        en.includes('wilt') || en.includes('water-soaked')) {
        return 'bacterial';
    }
    
    // Fungal-related keywords
    if (id.includes('fungal') || id.includes('mold') || id.includes('blight') || id.includes('rot') || 
        id.includes('rust') || id.includes('mildew') || id.includes('spot') || id.includes('lesion') || 
        id.includes('dieback') || id.includes('scab') || id.includes('smut') || id.includes('damping') ||
        id.includes('blast') || id.includes('anthracnose') || id.includes('scurf') || id.includes('powdery') ||
        en.includes('fungal') || en.includes('mold') || en.includes('blight') || en.includes('rot') || 
        en.includes('rust') || en.includes('mildew') || en.includes('spot') || en.includes('lesion') || 
        en.includes('dieback') || en.includes('scab') || en.includes('smut') || en.includes('damping') ||
        en.includes('blast') || en.includes('anthracnose') || en.includes('scurf') || en.includes('powdery') ||
        en.includes('ring') || en.includes('concentric') || en.includes('decay') || en.includes('coating')) {
        return 'fungal';
    }
    
    // Nutrient deficiency / general physiological keywords
    if (id.includes('deficiency') || id.includes('chlorosis') || id.includes('yellowing') || 
        id.includes('stunt') || id.includes('purple') || id.includes('pale') || id.includes('burn') ||
        en.includes('deficiency') || en.includes('chlorosis') || en.includes('yellowing') || 
        en.includes('stunted') || en.includes('purple') || en.includes('pale') || en.includes('burn') ||
        en.includes('cracking') || en.includes('splitting') || en.includes('growth') || en.includes('shedding')) {
        return 'nutrient';
    }
    
    if (en.includes('yellow') || en.includes('pale') || en.includes('stunt')) return 'nutrient';
    
    return 'fungal';
}

function getDiseaseDetails(cropId, cropName, category, lang) {
    let diseaseInfo = null;
    
    if (customDiseases[cropId] && customDiseases[cropId][category]) {
        diseaseInfo = customDiseases[cropId][category];
    } else {
        const gen = genericDiseases[category];
        diseaseInfo = {
            name: {
                en: `${cropName} ${gen.name.en}`,
                hi: `${cropName} ${gen.name.hi}`,
                gu: `${cropName} ${gen.name.gu}`
            },
            explanation: gen.explanation,
            severity: gen.severity,
            recovery: gen.recovery
        };
    }
    
    const name = diseaseInfo.name[lang] || diseaseInfo.name['en'];
    const explanation = diseaseInfo.explanation[lang] || diseaseInfo.explanation['en'];
    const severity = diseaseInfo.severity || "Yellow";
    
    const organic = treatments[category].organic[lang] || treatments[category].organic['en'];
    const chemical = treatments[category].chemical[lang] || treatments[category].chemical['en'];
    const prevention = treatments[category].prevention[lang] || treatments[category].prevention['en'];
    
    const fertilizer = suggestions[category].fertilizer[lang] || suggestions[category].fertilizer['en'];
    const irrigation = suggestions[category].irrigation[lang] || suggestions[category].irrigation['en'];
    const weather = suggestions[category].weather[lang] || suggestions[category].weather['en'];
    const earlyWarning = suggestions[category].earlyWarning[lang] || suggestions[category].earlyWarning['en'];
    const nearestAction = suggestions[category].nearestAction[lang] || suggestions[category].nearestAction['en'];
    
    const chances = diseaseInfo.recovery.chances || "Medium";
    const time = diseaseInfo.recovery.time[lang] || diseaseInfo.recovery.time['en'];
    const unrecoverable = diseaseInfo.recovery.unrecoverable_signs[lang] || diseaseInfo.recovery.unrecoverable_signs['en'];
    
    return {
        name,
        explanation,
        severity,
        organic,
        chemical,
        prevention,
        fertilizer,
        irrigation,
        weather,
        earlyWarning,
        nearestAction,
        recovery: {
            chances,
            time,
            unrecoverable_signs: unrecoverable
        }
    };
}

export function diagnoseCropLocally(cropId, cropName, selectedSymptoms, lang, cropsData) {
    // 1. Find crop symptoms list
    let cropSymptomsList = [];
    for (const cat in cropsData.cropsList) {
        const crop = cropsData.cropsList[cat].find(c => c.id === cropId);
        if (crop) {
            cropSymptomsList = crop.symptoms || [];
            break;
        }
    }
    
    // 2. Classify crop symptoms into categories
    const cropSymptomCategories = {
        fungal: [],
        viral: [],
        bacterial: [],
        pest: [],
        nutrient: []
    };
    
    cropSymptomsList.forEach(symId => {
        const symptom = cropsData.symptomsList.find(s => s.id === symId);
        if (symptom) {
            const cat = getSymptomCategory(symptom);
            cropSymptomCategories[cat].push(symId);
        }
    });
    
    // 3. Match user selected symptoms
    const userSelectedCount = selectedSymptoms.length;
    let results = [];
    
    for (const category of ['fungal', 'viral', 'bacterial', 'pest', 'nutrient']) {
        const cropCategorySymptoms = cropSymptomCategories[category];
        if (cropCategorySymptoms.length === 0) continue; // Crop doesn't have symptoms of this type
        
        const intersection = selectedSymptoms.filter(symId => cropCategorySymptoms.includes(symId));
        const matchedCount = intersection.length;
        
        let confidence = 0;
        if (matchedCount > 0) {
            const categoryRatio = matchedCount / cropCategorySymptoms.length;
            const userRatio = matchedCount / userSelectedCount;
            // Balanced score: 60% weight to category match, 40% to user selections match
            confidence = Math.round((categoryRatio * 0.6 + userRatio * 0.4) * 100);
            
            // Adjust bounds
            if (confidence < 15) confidence = 15;
            if (confidence > 98) confidence = 98; // Leave a tiny margin
        }
        
        results.push({
            category,
            confidence,
            matchedCount
        });
    }
    
    // Sort results: highest confidence first, then matchedCount
    results.sort((a, b) => b.confidence - a.confidence || b.matchedCount - a.matchedCount);
    
    // 4. Pad results to ensure we have at least 3 possibilities
    const allCategories = ['fungal', 'viral', 'bacterial', 'pest', 'nutrient'];
    while (results.length < 3) {
        const activeCats = results.map(r => r.category);
        const missingCat = allCategories.find(c => !activeCats.includes(c));
        if (missingCat) {
            results.push({
                category: missingCat,
                confidence: 10 + Math.floor(Math.random() * 8), // low confidence
                matchedCount: 0
            });
        } else {
            break;
        }
    }
    
    // If the top prediction has 0 matches (or no symptoms matched), return fallback template
    const topResult = results[0];
    if (topResult.matchedCount === 0) {
        // Safe fallback in case of no selected symptoms or weird input
        return null;
    }
    
    // 5. Build response object for primary disease
    const primaryDetails = getDiseaseDetails(cropId, cropName, topResult.category, lang);
    
    // Build top 3 diseases structure
    const topDiseases = results.slice(0, 3).map(res => {
        const details = getDiseaseDetails(cropId, cropName, res.category, lang);
        return {
            name: details.name,
            confidence: res.confidence
        };
    });
    
    // Cap primary confidence score
    const finalConfidence = Math.max(topResult.confidence, 40); // Baseline 40% if matched at least 1 symptom
    
    return {
        disease_name: primaryDetails.name,
        confidence_score: finalConfidence,
        severity_color: primaryDetails.severity,
        disease_explanation: primaryDetails.explanation,
        recovery_details: primaryDetails.recovery,
        organic_treatment: primaryDetails.organic,
        chemical_treatment: primaryDetails.chemical,
        prevention_methods: primaryDetails.prevention,
        fertilizer_suggestions: primaryDetails.fertilizer,
        irrigation_recommendations: primaryDetails.irrigation,
        weather_precautions: primaryDetails.weather,
        early_warning_signs: primaryDetails.earlyWarning,
        nearest_action: primaryDetails.nearestAction,
        top_diseases: topDiseases
    };
}
