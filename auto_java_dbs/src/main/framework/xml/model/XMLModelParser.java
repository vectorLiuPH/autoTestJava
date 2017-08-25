/**
 * 
 */
package main.framework.xml.model;

import java.io.InputStream;
import java.util.List;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import main.framework.common.FileUtil;
import main.framework.common.StringUtil;

/**
 * @author liupengh
 *
 */
public class XMLModelParser {
	
	private static InputStream loader(String classPath){
		return FileUtil.loadInputStream(classPath);
	}
	private static String[] getClassInfo(String classPath){
		String info=classPath.substring(1);
		String className=info.substring(info.indexOf("/")+1);
		String packageName=info.substring(0, info.indexOf("/"));
		return new String[] {packageName.replaceAll("/", "."),className.replaceAll("/", "_")};
	}
	private static String getClassPath(String currentClassPath, String includeFilePath){
		if (includeFilePath.startsWith("/"))
			return includeFilePath;
		else
			return currentClassPath + includeFilePath;
	}
	public static ScriptTag parse(String classPath){
		InputStream in=null;
		try{
			DocumentBuilderFactory documentBuilderFactory=DocumentBuilderFactory.newInstance();
			DocumentBuilder builder=documentBuilderFactory.newDocumentBuilder();
			in=loader("classPath:"+classPath);
			Document doc=builder.parse(in);
			Element root=doc.getDocumentElement();
			if(!root.getTagName().equals("script"))
				throw new IllegalArgumentException("root tag name is not script, invalid xml!");
			
			String currentClassPath=classPath.substring(0,classPath.lastIndexOf("/")+1);
			ScriptTag scriptTag=null;
			boolean isHaveTemplate=false;
			if(root.hasAttribute("template")){
				String templateFilePath=root.getAttribute("template");
				templateFilePath=getClassPath(currentClassPath,templateFilePath);
				scriptTag=parse(templateFilePath);
			}
			
			scriptTag=new ScriptTag();
			String[] classInfo=getClassInfo(classPath);
			scriptTag.setDeclarePackageName(classInfo[0]);
			scriptTag.setDeclareClassName(classInfo[1]);
			
			if(root.hasAttribute("input")){
				String value=root.getAttribute("input");
				if(StringUtil.isNotBlank(value)){
					String[] segs=value.split(",");
					for(String seg:segs){
						scriptTag.getParameterNames().add(seg);
					scriptTag.setTestDataFilePath(root.getAttribute("data"));
					}
				}
			}
			
			if(root.hasAttribute("web-driver")){
				String value=root.getAttribute("create-web-driver");
				if(StringUtil.isNotBlank(value))
					scriptTag.setCreateWebDriver(value.equals("true"));
			}
			
			NodeList nodes=root.getElementsByTagName("import");
			for(int i=0;i<nodes.getLength();i++){
				Element importElement=(Element) nodes.item(i);
				ImportTag importTag=new ImportTag();
				if(importElement.hasAttribute("package"))
					importTag.setPackageName(importElement.getAttribute("package"));
				scriptTag.getImportTagList().add(importTag);
			}
			
			nodes=root.getElementsByTagName("sql");	
			if(nodes.getLength()>1)
				throw new RuntimeException("there should be only 1 sql tag");
			if(nodes.getLength()==1){
				Element sqlElement=(Element) nodes.item(0);
				SqlTag sqlTag=new SqlTag();
				scriptTag.setSqlTag(sqlTag);
				if(sqlElement.hasAttribute("file"))
					sqlTag.setSqlScriptFilePath(sqlElement.getAttribute("file"));
				else{
					String c=sqlElement.getTextContent();
					if(c!=null)
						sqlTag.setSqlScriptContent(c.replaceAll("\n", ""));
				}
				
			}
			
			nodes=root.getElementsByTagName("define");
			if(nodes.getLength()>1)
				throw new RuntimeException("");
			if(nodes.getLength()==1){
				DefineTag defineTag=scriptTag.getDefineTag()!=null?scriptTag.getDefineTag():new DefineTag();
				scriptTag.setDefineTag(defineTag);
				Element defineElement=(Element) nodes.item(0);
				nodes=defineElement.getElementsByTagNameNS("dbs", "include");
				for(int i=0;i<nodes.getLength();i++){
					Element includeElement=(Element) nodes.item(i);
					if(includeElement.hasAttribute("file")){
						String filePath=includeElement.getAttribute("file");
						ScriptTag includeScriptTag=parse(getClassPath(currentClassPath,filePath));
						String prefix=includeElement.getAttribute("namespace");
						if(StringUtil.isBlank(prefix)){
							prefix=FileUtil.getFileNameWithoutExtension(filePath);
							}
						if(includeScriptTag.getDefineTag()!=null){
							List<ElementTag> includeElementTag=includeScriptTag.getDefineTag().getElementList();
							for(ElementTag elementTag:includeElementTag){
								elementTag.setElementName(prefix+"_"+elementTag.getElementName());
								defineTag.getElementList().add(elementTag);
							}
							List<BeanTag> includeBeanTagList=includeScriptTag.getDefineTag().getBeanList();
							for(BeanTag beanTag:includeBeanTagList){
								defineTag.getBeanList().add(beanTag);
							}
						}
					}						
				}
				nodes=defineElement.getElementsByTagName("element");
				if(nodes.getLength()>1){
					for(int i=0;i<nodes.getLength();i++){
						Element elementNode=(Element) nodes.item(i);
						ElementTag elementTag=new ElementTag();
						elementTag.setElementName(elementNode.getAttribute("name"));
						elementTag.setLocation(elementNode.getAttribute("location"));
						if(elementNode.hasAttribute("ignore_exception")){
							elementTag.setIgnoreException(elementNode.getAttribute("ignore_exception").equals("true"));
						}
						defineTag.getElementList().add(elementTag);
					}
				}
				nodes=defineElement.getElementsByTagName("bean");
				if(nodes.getLength()>1){
					for(int i=0;i<nodes.getLength();i++){
						Element beanNode=(Element)nodes.item(i);
						BeanTag beanTag=new BeanTag();
						beanTag.setBeanName(beanNode.getAttribute("name"));
						beanTag.setRef(beanNode.getAttribute("ref"));
						beanTag.setType(beanNode.getAttribute("type"));
						defineTag.getBeanList().add(beanTag);
					}
				}
				
			}
			boolean isHaveMain=false;
			nodes=root.getElementsByTagName("action");
			for(int i=0;i<nodes.getLength();i++){
				Element actionElement=(Element) nodes.item(i);
				ActionTag actionTag=null;
				if(!actionElement.hasAttribute("name")){
					if(isHaveMain)
						throw new RuntimeException("found mutliple main actions (which's name is empty)!");
					else
						isHaveMain=true;
					actionTag=scriptTag.getMainActionTag()!=null?scriptTag.getMainActionTag():new ActionTag();
					scriptTag.setMainActionTag(actionTag);
					actionTag.setActionStepList(parseActionStep(currentClassPath,isHaveTemplate,actionTag.getActionStepList(),actionElement.getChildNodes()));
				}
				else{
					actionTag=new ActionTag();
					actionTag.setName(actionElement.getAttribute("name"));
					actionTag.setActionStepList(parseActionStep(currentClassPath,false,actionTag.getActionStepList(),actionElement.getChildNodes()));
					scriptTag.getSubActionList().add(actionTag);
				}
			}
			return scriptTag;
		}catch(Exception e){
			throw new RuntimeException("fail to parse " + classPath, e);
		}finally{
			try{
				if(in!=null)
					in.close();
			}catch(Exception ex){}
		}
	}
	
	private static List<ActionStepTag> parseActionStep(String currentClassPath, boolean isHaveTemplate,List<ActionStepTag> list,NodeList nodes){
		
	}	
}
