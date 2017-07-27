package main.framework.common;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

import javax.security.auth.login.Configuration;

/**
 * @author liupengh
 *
 */
public class CommonConfiguration {
	private Properties pro;
	public void commonConfiguration(String classpath){
		pro=new Properties();
		InputStream is=Configuration.class.getResourceAsStream(classpath);
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
	public String get(String key){}
	public String get(String key, int defaultValue){}
	public int getInt(String key, int defaultValue){}
	public double getDouble(String key, double defaultValue){}
	public long getLong(String key, long defaultValue){}
	public boolean getBoolean(String key, boolean defaultValue){}
}
