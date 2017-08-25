/**
 * 
 */
package main.framework.xml.model;

import java.util.ArrayList;
import java.util.List;


/**
 * @author liupengh
 *
 */
public class ScriptTag extends BaseTag {
	
	private String declareClassName;
	private String declarePackageName;
	private List<String> parameterNames;
	private DefineTag defineTag;
	private ActionTag actionTag;
	private SqlTag sqlTag;
	private List<ImportTag> importTagList;
	private boolean isCreateWebDriver=true;
	private String testDataFilePath;
	private ActionTag mainActionTag;
	private List<ActionTag> subActionList;
	
	public List<ActionTag> getSubActionList() {
		return subActionList;
	}
	public void setSubActionList(List<ActionTag> subActionList) {
		this.subActionList = subActionList;
	}
	public String getDeclareClassName() {
		return declareClassName;
	}
	public void setDeclareClassName(String declareClassName) {
		this.declareClassName = declareClassName;
	}
	public String getDeclarePackageName() {
		return declarePackageName;
	}
	public void setDeclarePackageName(String declarePackageName) {
		this.declarePackageName = declarePackageName;
	}
	public List<String> getParameterNames() {
		if(parameterNames==null)
			parameterNames=new ArrayList<String>();
		return parameterNames;
	}	
	public DefineTag getDefineTag() {
		return defineTag;
	}
	public void setDefineTag(DefineTag defineTag) {
		this.defineTag = defineTag;
	}
	public ActionTag getActionTag() {
		return actionTag;
	}
	public void setActionTag(ActionTag actionTag) {
		this.actionTag = actionTag;
	}
	public SqlTag getSqlTag() {
		return sqlTag;
	}
	public void setSqlTag(SqlTag sqlTag) {
		this.sqlTag = sqlTag;
	}
	public List<ImportTag> getImportTagList() {
		if(importTagList==null)
			importTagList=new ArrayList<ImportTag>();
		return importTagList;
	}
	public boolean isCreateWebDriver() {
		return isCreateWebDriver;
	}
	public void setCreateWebDriver(boolean isCreateWebDriver) {
		this.isCreateWebDriver = isCreateWebDriver;
	}
	public String getTestDataFilePath() {
		return testDataFilePath;
	}
	public void setTestDataFilePath(String testDataFilePath) {
		this.testDataFilePath = testDataFilePath;
	}
	public ActionTag getMainActionTag() {
		// TODO Auto-generated method stub
		return mainActionTag;
	}
	public void setMainActionTag(ActionTag mainActionTag) {
		this.mainActionTag = mainActionTag;
	}

}
