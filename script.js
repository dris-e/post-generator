const post = document.querySelector(".post");
const initials = document.querySelector(".initials");
const profile = document.querySelector(".profile.img");
const profileInitial = document.querySelector(".profile.initial");
const date = document.querySelector(".date");
const name = document.querySelector(".name");
const verify = document.querySelector(".verify");
const title = document.querySelector(".title");
const description = document.querySelector(".description");
const image = document.querySelector(".image");
const likes = document.querySelector(".likes");
const comments = document.querySelector(".comments");
const shares = document.querySelector(".shares");
const socials = document.querySelectorAll(".socials .icon");
const platforms = ["reddit", "twitter", "instagram", "tiktok", "youtube", "facebook"];

let scale = 2;
let width = 400;
let jsons = [];
let index = 0;
let titleState = 0;

const generateInitials = (name) => {
  return name
    .replace(/@/g, "")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const visibility = () => {
  const socials = document.querySelectorAll(".social");
  socials.forEach((social) => {
    social.classList.toggle("hidden-false", social.querySelector("span").textContent === "0");
  });
};

visibility();

const updateJson = () => {
  const platform = Array.from(socials)
    .find((icon) => !icon.classList.contains("hidden"))
    .getAttribute("data-platform");
  const data = {
    name: name.textContent,
    initials: initials.textContent,
    date: date.textContent,
    title: title.textContent,
    description: description.textContent,
    image: image.classList.contains("hidden") ? null : image.src,
    likes: likes.textContent,
    comments: comments.textContent,
    shares: shares.textContent,
    verified: !verify.classList.contains("hidden"),
    width: width,
    profileImage: profile.classList.contains("hidden") ? null : profile.src,
    titleHidden: title.classList.contains("hidden"),
    descriptionHidden: description.classList.contains("hidden"),
    platform: platform,
  };
  jsons[index] = data;
  document.querySelector(".json").value = JSON.stringify(jsons, null, 2);
  visibility();
};

socials.forEach((icon) => {
  icon.onclick = () => {
    const currentPlatform = icon.getAttribute("data-platform");
    const currentIndex = platforms.indexOf(currentPlatform);
    const nextIndex = (currentIndex + 1) % platforms.length;
    const nextPlatform = platforms[nextIndex];

    socials.forEach((i) => i.classList.add("hidden"));

    const nextIcon = document.querySelector(`.socials .icon[data-platform="${nextPlatform}"]`);
    nextIcon.classList.remove("hidden");

    updateJson();
  };
});

name.oninput = () => {
  initials.textContent = generateInitials(name.textContent);
  updateJson();
};

initials.oninput = updateJson;
date.oninput = updateJson;
title.oninput = updateJson;
description.oninput = updateJson;

likes.oninput = () => {
  updateJson();
  visibility();
};

comments.oninput = () => {
  updateJson();
  visibility();
};

shares.oninput = () => {
  updateJson();
  visibility();
};

const lightButton = document.querySelector(".light");
const scaleButton = document.querySelector(".scaled");
const widthButton = document.querySelector(".width");
const titleButton = document.querySelector(".titled");
const verifyButton = document.querySelector(".verified");
// const randomizeButton = document.querySelector(".randomized");
const loadButton = document.querySelector(".load");
const generateButton = document.querySelector(".generate");
const nextButton = document.querySelector(".next");

lightButton.onclick = () => {
  const isLightMode = document.documentElement.getAttribute("data-theme") === "light";
  document.documentElement.setAttribute("data-theme", isLightMode ? "dark" : "light");
  lightButton.querySelector("p").textContent = isLightMode ? "Dark mode" : "Light mode";
};

scaleButton.onclick = () => {
  scale = scale === 2 ? 4 : scale === 4 ? 8 : 2;
  scaleButton.querySelector("p").textContent = `Scale ${scale}x`;
  // updateJson();
};

widthButton.onclick = () => {
  width = width === 400 ? 600 : width === 600 ? 800 : width === 800 ? 1000 : 400;
  document.documentElement.style.setProperty("--max", `${width}px`);
  widthButton.querySelector("p").textContent = `Width: ${width}px`;
  updateJson();
};

titleButton.onclick = () => {
  titleState = (titleState + 1) % 3;

  const updateClasses = (titleHidden, descriptionHidden, descriptionSecondary, descriptionTopsm, buttonText) => {
    title.classList.toggle("hidden", titleHidden);
    description.classList.toggle("hidden", descriptionHidden);
    description.classList.toggle("secondary", descriptionSecondary);
    description.classList.toggle("topsm", descriptionTopsm);
    titleButton.querySelector("p").textContent = buttonText;
  };

  switch (titleState) {
    case 0:
      updateClasses(false, false, false, false, "Disable title");
      break;
    case 1:
      updateClasses(true, false, true, true, "Disable description");
      break;
    case 2:
      updateClasses(false, true, false, false, "Enable title");
      break;
  }

  updateJson();
};

verifyButton.onclick = () => {
  verify.classList.toggle("hidden");

  const isVerified = !verify.classList.contains("hidden");
  verifyButton.querySelector("p").textContent = isVerified ? "Unverify" : "Verify";
  updateJson();
};

const loadPost = (i) => {
  const data = jsons[i];
  if (data) {
    if (data.name) name.textContent = data.name;
    if (data.initials) initials.textContent = data.initials;
    if (data.date) document.querySelector(".date").textContent = data.date;
    if (data.title) title.textContent = data.title;
    if (data.description) description.textContent = data.description;
    if (data.likes) document.querySelector(".likes").textContent = data.likes;
    if (data.comments) document.querySelector(".comments").textContent = data.comments;
    if (data.shares) document.querySelector(".shares").textContent = data.shares;
    if (data.verified !== undefined) {
      verify.classList.toggle("hidden", !data.verified);
      verifyButton.querySelector("p").textContent = data.verified ? "Unverify" : "Verify";
    }
    if (data.width) {
      width = data.width;
      document.documentElement.style.setProperty("--max", `${width}px`);
      widthButton.querySelector("p").textContent = `Width: ${width}px`;
    }
    if (data.profile) {
      profile.src = data.profile;
      profile.classList.remove("hidden");
      profileInitial.classList.add("hidden");
    } else {
      profile.classList.add("hidden");
      profileInitial.classList.remove("hidden");
    }
    if (data.titleHidden == undefined || !data.title) {
      title.classList.toggle("hidden", data.titleHidden);
      description.classList.toggle("secondary", !data.titleHidden);
      description.classList.toggle("topsm", !data.titleHidden);
      titleButton.querySelector("p").textContent = data.titleHidden ? "Enable title" : "Disable title";
    }
    if (data.descriptionHidden == undefined || !data.description) {
      description.classList.toggle("hidden", data.descriptionHidden);
      titleButton.querySelector("p").textContent = data.descriptionHidden ? "Enable description" : "Disable description";
    }

    if (data.image) {
      image.src = data.image;
      image.classList.remove("hidden");
    } else {
      image.classList.add("hidden");
    }
    if (data.currentPlatform) {
      socials.forEach((i) => i.classList.add("hidden"));
      const currentIcon = document.querySelector(`.socials .icon[data-platform="${data.currentPlatform}"]`);
      currentIcon.classList.remove("hidden");
    }
    updateJson();
  }
};

nextButton.onclick = () => {
  if (jsons.length > 0) {
    index = (index + 1) % jsons.length;
    loadPost(index);
  }
};

loadButton.onclick = () => {
  const json = document.querySelector(".json").value;
  if (!json.trim()) {
    updateJson();
  } else {
    try {
      const data = JSON.parse(json);
      if (Array.isArray(data)) {
        jsons = data;
      } else {
        const isDuplicate = jsons.some((existingData) => JSON.stringify(existingData) === JSON.stringify(data));
        if (!isDuplicate) {
          jsons.push(data);
        } else {
          alert("Duplicate JSON data");
        }
      }
      loadPost(index);
    } catch (e) {
      alert("Invalid JSON");
    }
  }
  console.log(jsons);
};

generateButton.onclick = () => {
  jsons.forEach((data, index) => {
    loadPost(index);
    html2canvas(post, {
      backgroundColor: null,
      scale: scale,
      logging: false,
      useCORS: true,
    }).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      const download = document.createElement("a");
      download.href = imageData;
      download.download = `generated_post_${index + 1}.png`;
      download.click();
    });
  });
};
