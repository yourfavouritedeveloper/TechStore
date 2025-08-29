import { useEffect } from "react";

function AdBanner({ slot }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log("AdSense error:", err);
    }
  }, []);

  return (
    <ins className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-2340118668313803"
      data-ad-slot={slot}       // slot ID from your AdSense dashboard
      data-ad-format="auto"
      data-full-width-responsive="true"></ins>
  );
}

export default AdBanner;