export const EVIROMENT = "development_tas";
//local
// export const richcleURL = `https://sso.richcle.com?appid=${process.env.VUE_APP_APPLICATION_ID}&fromwhere=http://localhost:8080/`;
//pro
export const richcleURL = `https://sso.richcle.com?appid=${process.env.VUE_APP_APPLICATION_ID}&fromwhere=${process.env.VUE_APP_ORIGIN_URL}`;
