package main.framework.common;

import org.openqa.selenium.WebDriver;

/**
 * @author liupengh
 *
 */
public class CommonWebDriver {
	
	WebDriver webDriver;
	public CommonWebDriver(WebDriver webDriver){
		this.webDriver=webDriver;
	}
	public void quit() {
		// TODO Auto-generated method stub
		webDriver.quit();
	}
	
	public WebDriver getWebDriver(){
		return this.webDriver;
	}
}
