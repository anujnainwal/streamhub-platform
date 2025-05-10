import BannerImage from "@/assets/images/movie-banner02.jpg";
import AvengerEndGame from "@/assets/images/avenger.jpg";
import Drama from "@/assets/images/Drama.jpeg";
import Action from "@/assets/images/actions.jpg";
import ScienceFiction from "@/assets/images/science-fiction.jpg";
import Horror from "@/assets/images/horror.jpeg";
import WatchAnyDevice from "@/assets/images/watch_any_device.png";

const movieList = {
  BannerImage: BannerImage,
  MOVIE_DRAMA: Drama,
  MOVIE_ACTION: Action,
  MOVIE_SCIENCE_FICTION: ScienceFiction,
  MOVIE_HORROR: Horror,
};

const TVFrameContent = {
  MOVIE_ONE: AvengerEndGame,
};

const watchAnyDeviceContent = {
  DeviceImage: WatchAnyDevice,
};

export { movieList, TVFrameContent, watchAnyDeviceContent };
