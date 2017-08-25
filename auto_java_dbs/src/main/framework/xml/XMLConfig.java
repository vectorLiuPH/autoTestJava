/**
 * 
 */
package main.framework.xml;

import main.framework.common.CommonConfiguration;

/**
 * @author liupengh
 *
 */
public class XMLConfig extends CommonConfiguration {
	

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static String _configFile="/config/common.properties";
	private static XMLConfig _instance=new XMLConfig(_configFile);
	
	public XMLConfig(String str) {
		// TODO Auto-generated constructor stub
		super(str);
	}
	
	public static String getProperties(String key,String def){
		return _instance.get(key, def);
	}
	
	public static XMLConfig getInstance(){
		return _instance;
	}
}
