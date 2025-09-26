export const formatCurrency = (str: string): number => {
  let cleanedStr = str.replace(/\s/g, "");

  cleanedStr = cleanedStr.replace(".", "");
  cleanedStr = cleanedStr.replace(",", ".");
  cleanedStr = cleanedStr.replace(/[^0-9.]/g, "");

  return Number.parseFloat(cleanedStr);
}