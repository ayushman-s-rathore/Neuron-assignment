export const fetchCSVData = async (path) => {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error('Failed to fetch CSV data');
      }
      const csvText = await response.text();
      return csvText;
    } catch (error) {
      console.error('Error fetching CSV data:', error);
      return null;
    }
};