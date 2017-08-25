/**
 * 
 */
package main.framework.xml;

import java.io.File;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.testng.ITestNGListener;
import org.testng.TestNG;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.nissan.dbs.autotest.framework.xml.XMLConfig;

import main.framework.common.FileUtil;
import main.framework.common.StringUtil;

/**
 * @author liupengh
 *
 */
public class DBSTestNGCaseRunner {
	//log
	private static Log logger=LogFactory.getLog(DBSTestNGCaseRunner.class);
	private static String Script_Prefix="-script";

	//主方法
	@SuppressWarnings("unchecked")
	public static void main(String args[]) throws Exception{
		List<String> filePathList=new ArrayList<String>();
		if(args==null||args.length==0)
			filePathList.add("/dbs.test.xml");
		else{
			for(String list:args){
				filePathList.add(list);
			}
		List<String> scriptPathList=new ArrayList<String>();
		for(int i=0;i<filePathList.size();i++){
			String filePath=filePathList.get(i);
			if(!filePath.startsWith(Script_Prefix)){
				logger.info("load script XML file list from "+filePathList.get(i));
				scriptPathList.addAll(load(filePathList.get(i)));
			}else{
				filePath=filePath.substring(Script_Prefix.length());
				logger.info("load script xml file"+filePath);
				String[] segs=StringUtil.split(filePath, ",");
				for(String seg:segs){
					scriptPathList.add(seg);
				}
			}
		}
		logger.info("found "+scriptPathList.size()+" script files, start to run ");
		TestNG testNG=new TestNG();
		boolean isUseDefaultListener=XMLConfig.getInstance().getBoolean("test.report.listener.isUserDefault",false);
		testNG.setUseDefaultListeners(isUseDefaultListener);
		if(!isUseDefaultListener){
			if(XMLConfig.getInstance().containsKey("test.report.listener.classes")){
				String[] classNames=StringUtil.split(XMLConfig.getInstance().getProperties("test.report.listener.classes", null),",");
				List<Class<? extends ITestNGListener>> listenerClass=new ArrayList<Class<? extends ITestNGListener>>();
				for(String className:classNames){
					listenerClass.add((Class<? extends ITestNGListener>)TestNG.class.getClassLoader().loadClass(className));
					testNG.setListenerClasses(listenerClass);
				}
			}
		}
		String reportDir=XMLConfig.getInstance().getProperties("test.report.dir", "/test-output");
		if(reportDir.startsWith("/")) {
			reportDir=new File("").getAbsolutePath()+reportDir;
		}
		testNG.setOutputDirectory(reportDir);
		testNG.setDefaultTestName(XMLConfig.getProperties("test.name", "DBS"));
		List<Class> classes=new ArrayList<Class>();
		for(i=0;i<scriptPathList.size();i++) {
			logger.info("load script file -- "+scriptPathList.get(i));
			Class clazz=
		}
		
		}
	}

	
	//加载script文件列表
	private static List<String> load(String xmlCfgList){
		InputStream is=null;
		try{
			DocumentBuilderFactory factory=DocumentBuilderFactory.newInstance();
			DocumentBuilder builder=factory.newDocumentBuilder();
			is=FileUtil.loadInputStream(xmlCfgList);
			Document doc=builder.parse(is);
			Element root=doc.getDocumentElement();
			if(!root.hasAttribute("test")){
				throw new IllegalArgumentException("");
			}
			NodeList nodes=root.getElementsByTagName("script");
			List<String> scriptPathList=new ArrayList<String>();
			for(int i=0;i<nodes.getLength();i++){
				Element tagElement=(Element) nodes.item(i);
				String scriptPath=tagElement.getAttribute("path");
				List<String> pathList=FileUtil.matchClassPathFileList(scriptPath);
				scriptPathList.addAll(pathList);
			}	
			return scriptPathList;
		}catch(Exception e){
			throw new RuntimeException("fail to load script configuration file from "+xmlCfgList,e);
		}finally{
			try{
				if(is!=null)
					is.close();
			}catch(Exception e){};
		}
		
	}
	
}
