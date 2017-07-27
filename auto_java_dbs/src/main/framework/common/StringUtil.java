package main.framework.common;

/**
 * @author liupengh
 *
 */
public class StringUtil {
	
	public static boolean isBlank(String str){
		return str==null||str.trim().equals("");
	}
	
	public static boolean isNotBlank(String str){
		return !isBlank(str);
	}
	
	public static String makeFirstLetterUpper(String str){
		return Character.toUpperCase(str.charAt(0))+str.substring(1);
	}	
	
}
