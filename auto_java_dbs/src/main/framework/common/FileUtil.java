package main.framework.common;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.eclipse.jetty.io.RuntimeIOException;

/**
 * @author liupengh
 *
 */
public class FileUtil {
	
	private final static String PREFIX_FILE="file";
	private final static String PREFIX_CLASSPATH="classpath";
	
	public static InputStream loadInputStream(String filePath){
		try{
			if(filePath.toLowerCase().startsWith(PREFIX_FILE)){
				filePath=filePath.substring(PREFIX_FILE.length());
				FileInputStream in=new FileInputStream(new File(filePath));
				return in;
			}else if(filePath.toLowerCase().startsWith(PREFIX_CLASSPATH)){
				filePath=filePath.substring(PREFIX_FILE.length());
			}
			return FileUtil.class.getResourceAsStream(filePath);
		}catch(IOException e){
			throw new RuntimeIOException(e);
		}
	}
	
	public static String loadText(String filePath){
		return loadText(filePath,null);
	}
	
	public static String loadText(String filePath,String charset){
		if(charset==null)
			charset="UTF-8";
		InputStream is=loadInputStream(filePath);
		try{
			ByteArrayOutputStream outStream=new ByteArrayOutputStream();
			byte[] data=new byte[4096];
			int count=-1;
			while((is.read(data,0,4096))!=count)
				outStream.write(data, 0, 4096);
			
			data=null;
			return new String(outStream.toByteArray(),charset);
		}catch(Exception e){
			throw new RuntimeException(e);
		}
		
	}
	public static String getFileNameWithoutExtension(String filePath){
		int i=filePath.lastIndexOf("/");
		if(i==-1) i=filePath.lastIndexOf("\\");
		String str=filePath.substring(i+1);
		return str.substring(0,str.indexOf("."));}

	public static List<String> matchClassPathFileList(String scriptPath) {
		// TODO Auto-generated method stub
		return null;
	}
}
