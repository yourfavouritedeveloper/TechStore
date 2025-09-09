import styles from "./Account.module.css"
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import spinner from "../../../public/brandlogo.png"
import axios from "axios";

    const USERNAME = import.meta.env.VITE_API_USERNAME;
    const PASSWORD = import.meta.env.VITE_API_PASSWORD;

function Account({ account }) {

      const [purchases, setPurchases] = useState([]);
      const [sellPurchases, setSellPurchases] = useState([]);

  useEffect(() => {
    axios
      .get(`https://techstore-3fvk.onrender.com/api/v1/purchases/account/to/${account.id}`,
        {
        auth: {
            username: USERNAME, 
            password: PASSWORD
        }
        }
        
      )
      
      .then((response) => {
        setSellPurchases(response.data); 
      })
      .catch((error) => {
        console.error("Error fetching purchases:", error);
      });
  }, [account]);


const getLastMonthData = (purchases = []) => {
  const now = new Date();
  const dates = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    dates.push(d.toLocaleDateString());
  }

  const purchaseMap = purchases.reduce((acc, p) => {
    const date = new Date(p.purchaseDate).toLocaleDateString();
    const totalSpent = (p.product?.price || 0) * (p.amount || 0);
    acc[date] = (acc[date] || 0) + totalSpent;
    return acc;
  }, {});

  return dates.map(date => ({
    date,
    amount: purchaseMap[date] || 0
  }));
};



const purchaseData = getLastMonthData(account?.purchases || []);

const tickDates = (() => {
  const len = purchaseData.length;
  if (len === 0) return [];
  return [
    purchaseData[0].date, 
    purchaseData[Math.floor(len / 2)].date, 
    purchaseData[len - 1].date 
  ];
})();




const getLastMonthDataSell = (sellPurchases = []) => {
  const now = new Date();
  const dates = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    dates.push(d.toLocaleDateString());
  }

  const purchaseMap = sellPurchases.reduce((acc, p) => {
    const date = new Date(p.purchaseDate).toLocaleDateString();
    const totalSpent = (p.product?.price || 0) * (p.amount || 0);
    acc[date] = (acc[date] || 0) + totalSpent;
    return acc;
  }, {});

  return dates.map(date => ({
    date,
    amount: purchaseMap[date] || 0
  }));
};

    

const purchaseDataSell = getLastMonthDataSell(sellPurchases || []);

const tickDatesSell = (() => {
  const len = purchaseDataSell.length;
  if (len === 0) return [];
  return [
    purchaseDataSell[0].date, 
    purchaseDataSell[Math.floor(len / 2)].date, 
    purchaseDataSell[len - 1].date 
  ];
})();

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const totalItems = account.products ? account.products.length : 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = account.products
    ? account.products.slice(startIndex, startIndex + itemsPerPage)
    : [];

    return  account.profilePictureUrl ? (
    <>
        <div className={styles.container}>
            <div className={styles.account}>
                <img className={styles.pp} src={account.profilePictureUrl} alt="Profile" />
                {account.backgroundImageUrl ? (<></>) : <></>}
                <div className={styles.name}>
                    <p className={styles.customerName}>{account.customerName}</p>
                    <p className={styles.username}>@{account.username}</p>
                </div>
            </div>
            <div className={styles.balanceContainer}>
                <p className={styles.balance}>Balance: ₼{account.balance}</p>
                <button className={styles.add}>Add Balance</button>
                <button className={styles.transaction}>Transaction History</button>
            </div>
            <p className={styles.descriptionTitle}>Description</p>
            <div className={styles.accountDescription}>
                <p className={styles.description}>{account.description}</p>
            </div>
            <div className={styles.editContainer}>
                <p className={styles.editTitle}>Edit Your Profile</p>
                <button className={styles.edit}>Update</button>
                <button className={styles.save}>Save</button>
            </div>
            <div className={styles.activityContainer}>
                <p className={styles.activityTitle}>Money Earned from Products</p>
                <p className={styles.activitySubTitle}>This chart shows how much money you earned each day from your product sales in the last month. Days without sales appear as zero, and the dates at the start, middle, and end make it easy to track your earnings over time.</p>
            <div className={styles.chart}>
                <ResponsiveContainer height={300}>
                <LineChart data={purchaseDataSell.length > 0 ? purchaseDataSell : [{ date: 'No Data', amount: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" ticks={tickDatesSell} />
                    <YAxis domain={[0, 'auto']} /> 
                    <Tooltip 
                    formatter={(value, name) => [`₼${value.toFixed(2)}`, 'Money Earned']}
                    labelFormatter={(label) => `Date: ${label}`} 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                    <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    dot={true} 
                    />
                </LineChart>
                </ResponsiveContainer>

            </div>
            </div>

            <div className={styles.itemsContainer}>
                <p className={styles.itemTitle}>Your Items for Sale</p>
                <p className={styles.itemSubtitle}>Here are all the products you’re currently selling. Click an item to view or edit its details.</p>
                      <ul className={styles.items}>
                       {currentItems && currentItems.length > 0 ? (  
                        currentItems.map((item) => (
                          <Link key={item.id} className={styles.item} 
                          to= {"/product/edit/" + item.id}
                          style={{ backgroundColor: "rgba(247, 247, 247, 1)" }}>
                            <img src={item.productImageUrl} alt={item.name}/>
                            <div className={styles.info}>
                            <p className={styles.name}>{item.name}</p>
                            <p className={styles.guarantee}>{item.guarantee} month</p>
                            <p className={styles.price}>₼{item.price}</p>
                            </div>
                          </Link>
                        ))) : (
                            <li className={styles.noItem}>
                              <p>No item found</p>
                            </li>)}
                              <li className={styles.addItem}>
                                <Link
                                to={"/" + account.username + "/product/add"}
                                className={styles.item}
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    fontSize: "2rem",
                                    color: "#3B82F6",
                                    backgroundColor: "rgba(247, 247, 247, 1)",
                                }}
                                >
                                +
                                    <div className={styles.info}>
                                        <p className={styles.name}>Add a new Item</p>
                                    </div>
                                </Link>
                            </li>
                      </ul>
                      {totalPages > 1 && (
                        <div className={styles.pagination}>
                            {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`${styles.pageButton} ${currentPage === i + 1 ? styles.active : ""}`}
                            >
                                {i + 1}
                            </button>
                            ))}
                        </div>
                        )}
            </div>

            <div className={styles.purchaseContainer}>
                <p className={styles.itemTitle}>Purchase History</p>
                <p className={styles.itemSubtitle}>View all your past purchases in one place. Easily track what you bought, when you bought it, and how much you spent.</p>
            </div>
              <div className={styles.spentContainer}>
                <p className={styles.activityTitle}>Money Spent in Purchases</p>
                <p className={styles.activitySubTitle}>This chart shows how much money you spent each day in the last month. Days with no purchases show as zero, and the dates at the start, middle, and end make it easy to see your spending over time.</p>
            <div className={styles.chart}>
                <ResponsiveContainer height={300}>
                <LineChart data={purchaseData.length > 0 ? purchaseData : [{ date: 'No Data', amount: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" ticks={tickDates} />
                    <YAxis domain={[0, 'auto']} /> 
                    <Tooltip 
                    formatter={(value, name) => [`₼${value.toFixed(2)}`, 'Money Spent']}
                    labelFormatter={(label) => `Date: ${label}`} 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ccc' }}
                    />
                    <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#f63b3bff" 
                    strokeWidth={2} 
                    dot={true} 
                    />
                </LineChart>
                </ResponsiveContainer>

            </div>
            </div>


        </div>
    </>) : (
        <>
        <div className={styles.loadingContainer}>
            <img src={spinner} alt="Loading..." className={styles.loadingImage} />
        </div>
    </>
    
    
    );
}

export default Account;