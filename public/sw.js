// 이 프로젝트는 서비스워커를 사용하지 않음.
// 이전에 동일 origin(localhost:3000)에 등록되었을 수 있는 서비스워커를
// 자동으로 해지(unregister)시키기 위한 킬 스위치.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.registration.unregister().then(() => {
    return self.clients.matchAll({ type: "window" });
  }).then((clients) => {
    clients.forEach((client) => client.navigate(client.url));
  });
});
