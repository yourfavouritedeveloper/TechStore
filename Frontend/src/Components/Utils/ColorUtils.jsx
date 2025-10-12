export async function fetchColorFromName(name) {
  if (!name) return "#CCCCCC"; 
  try {
    const response = await fetch(
      `https://www.thecolorapi.com/id?name=${encodeURIComponent(name)}`
    );

    if (!response.ok) {
      console.warn(`ColorAPI: "${name}" not found, using fallback`);
      return "#CCCCCC";
    }

    const data = await response.json();
    return data.hex?.value || "#CCCCCC";
  } catch (err) {
    console.error("Color fetch failed:", err);
    return "#CCCCCC";
  }
}
