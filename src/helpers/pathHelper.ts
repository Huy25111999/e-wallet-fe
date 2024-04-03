export function getParams(path: string) {
  // Lấy chuỗi params
  const paramString = path.split("?")[1];

  // Tách chuỗi params thành một mảng các cặp key-value
  if (paramString) {
    const paramPairs = paramString.split("&");

    // Tạo object để lưu trữ các giá trị params
    const params: any = {};

    // Vòng lặp để lấy giá trị của từng cặp key-value và thêm vào object params
    paramPairs.forEach((pair) => {
      const [key, value] = pair.split("=");
      params[key] = value;
    });

    // Trả về object params
    return params;
  }
}
