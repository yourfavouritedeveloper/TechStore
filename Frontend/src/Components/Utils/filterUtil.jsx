export const applyFilters = (items, options) => {
  let filtered = [...items];

  if (options.category) {
    filtered = filtered.filter(item => item.category === options.category);
  }



  if (options.date === "newest") {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (options.date === "oldest") {
    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  if (options.price === "lowToHigh") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (options.price === "highToLow") {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
};
