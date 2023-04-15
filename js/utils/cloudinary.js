export const getVideoPoster = (videoUrl) => {
  const videoToImg = videoUrl.replace(".mp4", ".jpg");

  const posterImage = videoToImg.replace("upload", "upload/q_auto,f_auto,so_0");

  return posterImage;
};

export const optimizeCloudinaryUrl = (url) => {
  return url.replace("upload", "upload/q_auto,f_auto");
};
