
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { SiteData, AdPlatformData, AdCardData } from '../types';

// Export types for components that might still look for them here (optional, for backward compat during refactor)
export type { SiteData, AdPlatformData, AdCardData };

interface DataContextType {
  siteData: SiteData;
  updateSiteData: (newData: SiteData) => Promise<void>;
  resetToDefault: () => void;
  updateAdPlatformData: (newData: AdPlatformData) => void; 
}

// --- Default Data Configuration ---
// This acts as the initial state and fallback if the DB is empty
const defaultSiteData: SiteData = {
  brand: {
    line1: "TRIPP COUCH",
    line2: "STUDIO"
  },
  hero: {
    title: "Your Complete Launch Platform:\nIntegrated Ads, Brand Design & Marketing.",
    subtitle: "MARKETING. BRANDING. DESIGNING.",
    ctaText: "", 
    imageUrl: "https://cdni.iconscout.com/illustration/premium/thumb/digital-marketing-illustration-download-in-svg-png-gif-file-formats--business-social-media-online-advertisement-pack-illustrations-3375080.png"
  },
  services: {
    topServices: [
      { id: 's1', title: "Marketing Strategies", description: "Planning and executing data-driven ad campaigns to boost visibility, drive engagement, and increase conversions.", btnText: "Connect With Us", imageUrl: "" },
      { id: 's2', title: "Branding", description: "Positioning your brand, creating campaigns, and defining your voice.", btnText: "Connect With Us", imageUrl: "" },
      { id: 's3', title: "Website and App Design", description: "Modern, easy-to-understand website (portfolio, e-commerce, or business)", btnText: "Connect With Us", imageUrl: "" }
    ],
    moreServices: [
      { id: 'cat1', categoryName: "BRANDING", items: ["Brand & Strategy", "Positioning", "Storytelling & Copy", "Logos & Brand Marks"] },
      { id: 'cat2', categoryName: "DIGITAL PRODUCTS", items: ["Product Design & Development"] },
      { id: 'cat3', categoryName: "DIGITAL MEDIA", items: ["Website Design & Devlopement", "User Interface/Experience", "Motion Graphics"] },
      { id: 'cat4', categoryName: "VISUAL COMMUNICATION", items: ["Graphic Design & Illustrations", "Typeface Design", "Photography and Videography"] }
    ]
  },
  stats: {
    mainText: "Tripp Couch Studio craft visual and marketing Strategies that elevate your brand.",
    stat1: { val: "08+", label: "websites launched" },
    stat2: { val: "13+", label: "Active campaigns for multiple companies and brands" },
    stat3: { val: "25+", label: "Different clients have sought our expertise" },
    ctaTitle: "Looking for Expert Guidance?",
    ctaDescription: "Schedule a consultation with our media planner to seamlessly strategize and place your next promotion."
  },
  contact: {
    address: "Tidke Nagar, Behind City Center mall\nNashik, MH.\n422009",
    phone: "+91-7416155266",
    email: "Contact@trippcouchstudio.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com"
  },
  adPlatform: {
    platformName: "Zee5",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Zee5-official-logo.jpeg",
    heroBackgroundImageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1000&auto=format&fit=crop", 
    homeSection: {
      title: "Target 100M+ Engaged Viewers on Zee5",
      description: "Zee5 is one of India's leading streaming platforms, captivating a massive and loyal audience with premium shows and movies in 12 languages. Through our advertising partnership, we place your targeted, high-impact ads directly into this engaged content stream. Reach millions of viewers at the peak of their attention and drive real results with a brand presence that connects.",
      buttonText: "Advertise on Zee5"
    },
    header: {
      monthlyUsers: "100 M",
      platformType: "APP & WEBSITE",
      budgetDescription: "Offering a variety of Indian TV shows and movies, Zee5 is a popular video streaming platform that is famous for a wide range of content in approx 12 languages. Zee5 uses engaging content to capture the attention of majorly Hindi-speaking users and improve visibility and awareness among them. With a Zee5 association, brands will be able to reach a larger user base through targeted ads.",
      pricingModels: "CPM, CPCV, Fixed",
      bidType: "Self and Managed Bid",
      categories: "OTT, Entertainment"
    },
    intro: {
      title: "Zee 5 Advertising Details",
      p1: "Zee5 is a leading on-demand video streaming service operated by Zee Entertainment Enterprises. As a popular OTT platform with a vast audience, it offers exceptional opportunities for brand visibility and awareness. Zee5 advertising allows brands to engage potential customers effectively, driving sales by targeting viewers directly within the app experience. The platform integrates high-impact ads seamlessly alongside its content.",
      p2: "Featuring a diverse library of content in over 12 languages, including popular shows like Kumkum Bhagya, Kundali Bhagya, and Meet, Zee5 provides a powerful channel to reach and grow your target customer base. Its comprehensive advertising solutions include video ads, banner ads, masthead placements, and more.",
      p3: "By leveraging Zee5 for advertising, businesses can significantly enhance their marketing strategy and expand their reach. Interested in launching a campaign on Zee5? Contact us today to secure the best available advertising rates."
    },
    cards: [
      {
        id: '1',
        title: "Banner Ad",
        description: "Banners Ads in Zee5 App are displayed on the homepage and will run on site as rectangular image ads in various sizes.",
        price: "₹ 1,80,123",
        imageUrl: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1557838403-996675883e56?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop"
        ],
        category: 'top',
        stats: { usedFor: "Reach", adType: "Image", leadTime: "48 - 72 Hours", span: "1 Day" },
        pricing: { original: "₹ 19,18,012", discounted: "₹ 1,91,80,123", minBilling: "₹ 19,18,0123" },
        executionDetails: [
          {
            title: "CREATIVE TYPE : IMAGE",
            fields: [
              { label: "DEVICE", value: "Desktop" },
              { label: "WIDTH", value: "300px" },
              { label: "HEIGHT", value: "250px" },
              { label: "FORMAT", value: ".JPG" },
              { label: "MAX FILE SIZE", value: "Below 100kb" }
            ]
          },
          {
            title: "CREATIVE SPEC 2 : IMAGE",
            fields: [
              { label: "DEVICE", value: "Mobile" },
              { label: "WIDTH", value: "320px" },
              { label: "HEIGHT", value: "50px" },
              { label: "FORMAT", value: ".JPG" },
              { label: "MAX FILE SIZE", value: "Below 50kb" }
            ]
          },
          {
            title: "SOP",
            fields: [
              { label: "PROOF OF EXECUTION", value: "#Analytics and POE Report will be provided - (POE Report which includes the Impressions, reach, clicks, etc). It provides the KPI as per the campaign. # Reports will be provided after 24hrs once the campaign goes live." },
              { label: "FIRST PROOF OF EXECUTION", value: "24 Hours" },
              { label: "PROOF OF EXECUTION FREQUENCY", value: "At the end of the campaign only" }
            ]
          }
        ],
        contentSections: [
            {
                title: "Zee5 Banner Advertising",
                content: "Zee5 Banner ads are a highly effective way to promote your brand across various digital media platforms. These visually engaging ads can greatly enhance your online visibility, helping you reach a wider audience. Below, we cover all the essential aspects of banner ads, including their costs and templates that work best for platforms like Zee5."
            },
            {
                title: "Zee5 Banner Advertising Cost",
                content: [
                    "Platform: Different digital platforms have varying costs. For example, Instagram generally has higher costs due to its large user base.",
                    "Ad Format: The type of ad you choose (static, animated, or interactive) can affect the cost.",
                    "Audience Targeting: Advanced targeting options (like demographics, interests) help you reach a specific audience but may increase costs.",
                    "Campaign Duration: Longer campaigns tend to be more expensive overall but provide better exposure."
                ]
            }
        ]
      },
      // ... (Add more default cards as needed)
    ],
    faqs: [
      {
        id: 'f1',
        question: "Why should you Advertise in Zee5?",
        answer: [
          "Zee5 is a leading OTT platform in India with over 100 million monthly active users, making it a premier digital video destination.",
          "Through precise ad targeting, Zee5 ensures your campaigns engage the right viewers.",
          "As a trusted and widely-used streaming service, Zee5 provides significant advertising value."
        ]
      }
    ]
  }
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteData>(defaultSiteData);
  // We keep useAuth here just to ensure it's initialized, though not strictly used in this version
  // but helpful if we want to restrict read access in future.
  const { currentUser } = useAuth();

  useEffect(() => {
    // Real-time listener for site content updates
    const docRef = db.collection('site_content').doc('main');
    const unsubscribe = docRef.onSnapshot((docSnap) => {
      if (docSnap.exists) {
        const data = docSnap.data() as SiteData;
        // Merge with default data to ensure no missing fields if DB is partial
        setSiteData({...defaultSiteData, ...data, hero: {...defaultSiteData.hero, ...data.hero}});
      } else {
        console.warn("No remote data found. Using default local data.");
      }
    }, (error) => {
        console.error("Error reading site data:", error);
    });

    return () => unsubscribe();
  }, []);

  const updateSiteData = async (newData: SiteData) => {
    setSiteData(newData); // Optimistic Update
    try {
        const docRef = db.collection('site_content').doc('main');
        await docRef.set(newData);
    } catch (e) {
        console.error("Failed to sync to cloud.", e);
        alert("Failed to save changes. Please check your connection or permissions.");
    }
  };

  const updateAdPlatformData = (newAdPlatformData: AdPlatformData) => {
    const updated = { ...siteData, adPlatform: newAdPlatformData };
    updateSiteData(updated);
  };

  const resetToDefault = () => {
    if (confirm("Are you sure? This will overwrite the live database with default template data.")) {
        updateSiteData(defaultSiteData);
    }
  };

  return (
    <DataContext.Provider value={{ siteData, updateSiteData, updateAdPlatformData, resetToDefault }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
