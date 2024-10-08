chrome.storage.local.get("series", async function (result) {
    try {
        if (result && result.series && result.series.length > 0) {
            let text = "";
            const fruits = result.series.slice().reverse(); // Make a copy and reverse it

            let counter = 0;
            fruits.forEach((item, index) => {
                if (counter < 8 && item && item.url && item.name && item.season) {
                    text += `<a href="${item.url}"><div class="item"><div class="title">${index + 1}. ${item.name}</div><div class="episode">${item.season}</div></div></a>`;
                    counter++;
                }
            });

            document.getElementById("historyList").innerHTML = text;
        } else {
            // Handle the case when "series" is empty or not found
            console.log("No 'series' found in storage or it's empty.");
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error("An error occurred:", error);
    }
});
