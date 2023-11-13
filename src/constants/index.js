export const sidebarLinks = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/wallpaper.svg",
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: "/assets/icons/bookmark.svg",
    route: "/saved",
    label: "Saved",
  },
  {
    imgURL: "/assets/icons/gallery-add.svg",
    route: "/create-post",
    label: "Create Post",
  },
];

export const bottombarLinks = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/wallpaper.svg",
    route: "/explore",
    label: "Explore",
  },
  {
    imgURL: "/assets/icons/bookmark.svg",
    route: "/saved",
    label: "Saved",
  },
  {
    imgURL: "/assets/icons/gallery-add.svg",
    route: "/create-post",
    label: "Create",
  },
];

export function formatTimestamp(timestamp) {
  const postDate = new Date(timestamp);
  const currentDate = new Date();

  const timeDifferenceInSeconds = Math.floor((currentDate - postDate) / 1000);

  if (timeDifferenceInSeconds < 60) {
    return 'just now';
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} ago`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours} ${hours > 1 ? 'hours' : 'hour'} ago`;
  } else if (timeDifferenceInSeconds < 604800) {
    const days = Math.floor(timeDifferenceInSeconds / 86400);
    return `${days} ${days > 1 ? 'days' : 'day'} ago`;
  } else {
    const formattedDate = postDate.toLocaleDateString('en-GB', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
    return formattedDate;
  }
};

export const checkIsLiked = (likesArray, userId) => {
  return likesArray?.includes(userId);
};