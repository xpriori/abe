export default async (text: string, callback) => {
  try {
    const response = await fetch("../api/organizer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const organizedData = await response.json();
    if (response.status !== 200) {
      throw (
        organizedData.error ||
        new Error(`Request failed with status ${response.status}`)
      );
    }

    callback(organizedData.result);
  } catch (error) {
    return error;
  }
};
