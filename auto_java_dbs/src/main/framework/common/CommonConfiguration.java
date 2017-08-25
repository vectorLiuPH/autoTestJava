package main.framework.common;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * @author liupengh
 *
 */
public class CommonConfiguration extends Properties {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Properties pro;
	public CommonConfiguration(String classpath){
		pro=new Properties();
		InputStream is=CommonConfiguration.class.getResourceAsStream(classpath);
		try {
			pro.load(is);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			throw new RuntimeException(e);
		}finally{
			try{
				is.close();
			}catch(IOException e){
				e.printStackTrace();
			}
		}
		}
	public String get(String key){
		return getProperty(key);
	}
	public String get(String key, String defaultValue){
		return getProperty(key,defaultValue);
	}
	public int getInt(String key, int defaultValue){
		String ret=get(key);
		if(StringUtil.isBlank(ret))
			return defaultValue;
		return Integer.parseInt(ret);
	}
	public double getDouble(String key, double defaultValue){
		String ret=get(key);
		if(StringUtil.isBlank(ret))
			return defaultValue;
		return Double.parseDouble(ret);
	}
	public long getLong(String key, long defaultValue){
		String ret=get(key);
		if(StringUtil.isBlank(ret))
			return defaultValue;
		return Long.parseLong(ret);
	}
	public boolean getBoolean(String key, boolean defaultValue){
		String ret=get(key);
		if(StringUtil.isBlank(ret))
			return defaultValue;
		ret=ret.trim().toUpperCase();
		return ret=="Y"||ret=="T"||ret=="TRUE"||ret=="1"||ret=="YES";
	}
}
