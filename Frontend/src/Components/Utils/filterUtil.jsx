export function applyFilters(items, sortOptions) {
  return [...items].sort((a, b) => {


    if (sortOptions.price) {
      const priceDiff = sortOptions.price === "lowToHigh" ? a.price - b.price : b.price - a.price;
      if (priceDiff !== 0) return priceDiff;
    }

    if (sortOptions.date) {
      const dateDiff = sortOptions.date === "newest"
        ? (b.createdAt > a.createdAt ? 1 : -1)
        : (a.createdAt > b.createdAt ? 1 : -1);
      if (dateDiff !== 0) return dateDiff;
    }

        if (sortOptions.bestSelling) {
      const diff = sortOptions.bestSelling === "highToLow" ? b.bought - a.bought : a.bought - b.bought;
      if (diff !== 0) return diff;
    }




    return 0; 
  });
}
