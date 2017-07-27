package main.framework.common;

import java.net.URL;
import java.util.Properties;

import org.apache.commons.beanutils.ConstructorUtils;
import org.openqa.selenium.Platform;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.remote.BrowserType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;

/**
 * @author liupengh
 *
 */
public class CommonWebDriverFactory {
	private Properties propertise;
	private ThreadLocal<CommonWebDriver> threadLocal = new ThreadLocal<CommonWebDriver>();

	public void setPropertise(Properties propertise) {
		this.propertise = propertise;
	}

	private DesiredCapabilities init() throws Exception {
		String browserType = propertise.getProperty("");
		String browerVersion = propertise.getProperty("");
		String browserPlatformType = propertise.getProperty("");
		Class<BrowserType> clazz = BrowserType.class;
		String broswerTypeValue = (String) clazz.getField(browserType).get(null);
		Platform browserPlatformTypeValue = Platform.valueOf(browserPlatformType);
		DesiredCapabilities dc = new DesiredCapabilities(broswerTypeValue, browerVersion, browserPlatformTypeValue);
		return dc;
	}

	public CommonWebDriver create(){
		WebDriver webDriver=null;
		String className=propertise.getProperty("driver.class");
		Boolean isRemote=propertise.getProperty("driver.remote").equals("true");
		try{
			DesiredCapabilities dc=init();
			String browserType=propertise.getProperty("driver.capabilities.broswer.type");
			for(Object key : propertise.keySet()){
				String keyStr=key.toString();
				if(keyStr.startsWith("driver.capabilities."+browserType)){
					String dcKey=keyStr.replaceAll("driver\\.capabilities\\."+browserType+"\\.", "");
					String[] values=propertise.getProperty(keyStr).split(",");
					if(values.length==1){
						dc.setCapability(dcKey, values[0]);
					}else if(values.length==2){
						if(values[0].equals("bool"))
							dc.setCapability(dcKey, values[1].equals("true"));
						else if(values[0].equals("int"))
							dc.setCapability(dcKey, Integer.parseInt(values[1]));
						else
							throw new RuntimeException("unknown data type '"+values[0]+"', cannot setup capability parameters for web driver!");
					}
				}
			}
			if(!isRemote){	
				String driverPath=propertise.getProperty("driver.path");
				if(driverPath.startsWith(".")){
					driverPath=new java.io.File("").getAbsolutePath()+driverPath.substring(1);
				}
				System.setProperty(propertise.getProperty("driver.name"),driverPath);
				webDriver=(WebDriver) ConstructorUtils.invokeConstructor(CommonWebDriverFactory.class.getClassLoader().loadClass(className),dc);
			}else{
				String remoteURL=propertise.getProperty("driver.remote.url");
				webDriver=new RemoteWebDriver(new URL(remoteURL),dc);
			}
		}catch(Exception e){
			throw new RuntimeException(e);
		}
		CommonWebDriver cWebDriver=new CommonWebDriver(webDriver);
		threadLocal.set(cWebDriver);
		return cWebDriver;		
	}
	
	public void destroy(CommonWebDriver commonWebDriver){
		threadLocal.remove();
		commonWebDriver.quit();
	}
	public CommonWebDriver getCurrentDriver(){
		return threadLocal.get();
	}
}
