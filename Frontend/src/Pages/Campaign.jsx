
import { useEffect, useState } from "react";
import CampaignPage from "../Components/CampaignPage/CampaignPage";
import Nav from "../Components/Nav/Nav";
import Footer from "../Components/Footer/Footer";


function Campaign() {

    const [highlight,setHighlight] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
        window.onbeforeunload = () => window.scrollTo(0, 0);
    }, []);


    return  (
    <>
        <title>TechStore | Campaigns</title>
        <Nav highlight={highlight} />
        <CampaignPage setHighlight={setHighlight} />
        <Footer />
        
    </>);
}

export default Campaign;