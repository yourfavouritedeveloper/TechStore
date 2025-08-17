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

    else if (sortOptions.searchRating) {
      const diff = sortOptions.searchRating === "highToLow" ? b.searched - a.searched : a.searched - b.searched;
      if (diff !== 0) return diff;
    }

     else if (sortOptions.alphabetical) {
      const diff = sortOptions.alphabetical === "highToLow" ?b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      if (diff !== 0) return diff;
    }

    else if (sortOptions.stock) {
      const diff = sortOptions.stock === "highToLow" ? b.amount - a.amount : a.amount - b.amount;
      if (diff !== 0) return diff;
    }

   else if (sortOptions.rating) {
      const diff = sortOptions.rating === "highToLow" ? Number(b.rating) - Number(a.rating) : Number(a.rating) - Number(b.rating);
      if (diff !== 0) return diff;
    }

   else if (sortOptions.discount) {
      const diff = sortOptions.discount === "highToLow" ? b.discount - a.discount :a.discount -b.discount;
      if (diff !== 0) return diff;
    }




    return 0; 
  });
}
