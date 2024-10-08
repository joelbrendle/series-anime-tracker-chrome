chrome.webNavigation.onCompleted.addListener((details) => {
    const currentUrl = new URL(details.url);

    if (currentUrl.hostname === 's.to' || currentUrl.hostname === 'aniworld.to') {
        // Get the title and URL of the current tab

        chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
            tabUrl = tabs[0];

            if (tabUrl) {
                var title = tabUrl.title;
                var url = tabUrl.url;
                var season = '';

                const inputString = title;

                // Define a regular expression to extract episode and season information
                const episodeSeasonRegex = /Episode (\d+) Staffel (\d+)/;
                const match2 = inputString.match(episodeSeasonRegex);

                // Define a regular expression to extract the series title
                const seriesTitleRegex = /von (.+?) \|/;
                const titleMatch = inputString.match(seriesTitleRegex);

                if (match2 && titleMatch) {
                    const episode = match2[1];
                    const episode_season = match2[2];
                    const seriesTitle = titleMatch[1];

                    season = `Episode ${episode} Staffel ${episode_season}`;
                    title = seriesTitle;

                    console.log("Episode:", episode);
                    console.log("Season:", episode_season);
                    console.log("Series Title:", seriesTitle);

                    // Extract the tag from the URL
                    const match = url.match(/\/stream\/([^/]+)/);
                    let tag = 'a';

                    if (match && match[1]) {
                        tag = match[1];
                        console.log("Tag: " + tag);

                        // Check if "series" is already in local storage
                        chrome.storage.local.get("series", (result) => {
                            const seriesData = result.series || [];

                            const existingSeriesIndex = seriesData.findIndex(serie => serie.id === tag);

                            if (existingSeriesIndex !== -1) {
                                console.log('Series already exists');

                                // Update the name of the existing series
                                seriesData[existingSeriesIndex] = {
                                    id: tag,
                                    name: title,
                                    season: season,
                                    url: url,
                                };
                                chrome.storage.local.set({ series: seriesData });
                                console.log('Updated series name');
                            } else {
                                console.log('Series does not exist');

                                // Define the new series object
                                const newSeries = {
                                    id: tag,
                                    name: title,
                                    season: season,
                                    url: url,
                                };

                                // Add the new series object to the existing series array
                                seriesData.push(newSeries);

                                // Store the updated series object in local storage
                                chrome.storage.local.set({ series: seriesData });
                                console.log('Added new series');
                            }
                        });

                    } else {
                        console.log("Tag not found in the URL.");
                    }
                } else {
                    console.log("Pattern not found in the input string.");
                }
            }
        })
    }
});
