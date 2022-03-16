class Button {
  label
  clickMethod
	btnClass  // 按钮样式

  constructor(label, clickMethod, btnClass) {
    this.label = label
    this.clickMethod = clickMethod
		this.btnClass = btnClass
  }
}

export {
  Button
}
