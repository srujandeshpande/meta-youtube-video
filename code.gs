const updateYouTubeVideo = (e = null) => {
  const id = "zmtdM5b_vts";
  const template = "This video has VIEWCOUNT views and COMMENTCOUNT comments";

  // The cron job is created only when the script is run manually
  if (e === null) {
    const triggerName = "updateYouTubeVideo";
    const triggers = ScriptApp.getProjectTriggers().filter((trigger) => {
      return trigger.getHandlerFunction() === triggerName;
    });

    // If time based trigger doesn't exist, create one that runs every 5 minutes
    if (triggers.length === 0) {
      ScriptApp.newTrigger(triggerName).timeBased().everyMinutes(5).create();
    }
  }

  // Get the watch statistics of the video
  const { items: [video = {}] = [] } = YouTube.Videos.list(
    "snippet,statistics",
    {
      id
    }
  );

  // Parse the YouTube API response to get views and comment count
  const {
    snippet: { title: oldTitle, categoryId } = {},
    statistics: { viewCount, commentCount } = {}
  } = video;

  if (viewCount && commentCount) {
    const newTitle = template
      .replace("VIEWCOUNT", viewCount)
      .replace("COMMENTCOUNT", commentCount);

    // If the video title has not changed, skip this step
    if (oldTitle !== newTitle) {
      YouTube.Videos.update(
        { id: id, snippet: { title: newTitle, categoryId } },
        "snippet"
      );
    }
  }
