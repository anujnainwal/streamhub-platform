import BannerImage from "@/assets/images/movie-banner02.jpg";
import AvengerEndGame from "@/assets/images/avenger.jpg";
import Drama from "@/assets/images/Drama.jpeg";
import Action from "@/assets/images/actions.jpg";
import ScienceFiction from "@/assets/images/science-fiction.jpg";
import Horror from "@/assets/images/horror.jpeg";
import WatchAnyDevice from "@/assets/images/watch_any_device.png";
import DefaultUserImage from "@/assets/images/default-user.jpg";

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

const UserImage = {
  DEFAULT: DefaultUserImage,
};

const movieImageList = {
  MOVIE_ONE:
    "https://i0.wp.com/www.tomrichmond.com/wp-content/uploads/2008/07/29look4.jpg?resize=425%2C287&ssl=1",
  MOVIE_TWO:
    "https://www.johnpaulcaponigro.com/blog/wp-content/uploads/2024/03/Inception.jpg",
  MOVIE_THREE:
    "https://communist.red/wp-content/uploads/2022/08/godfather.png.webp",
  MOVIE_FOUR: "https://i.ytimg.com/vi/YF1eYbfbH5k/maxresdefault.jpg",
};

export {
  movieList,
  TVFrameContent,
  watchAnyDeviceContent,
  UserImage,
  movieImageList,
};
