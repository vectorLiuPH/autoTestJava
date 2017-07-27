/**
 * 
 */
package main.framework.xml.model;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.nissan.dbs.autotest.framework.common.StringUtil;

/**
 * @author liupengh
 *
 */
public class ActionStepTag extends BaseTag {
	
	private String nameSpace;
	private String tagName;
	private Map<String,String> attributes;
	private String content;
	private List<ActionStepTag> stepList;
	public String getNameSpace() {
		return nameSpace;
	}
	public void setNameSpace(String nameSpace) {
		this.nameSpace = nameSpace;
	}
	public String getTagName() {
		return tagName;
	}
	public void setTagName(String tagName) {
		this.tagName = tagName;
	}
	public Map<String, String> getAttributes() {
		if(attributes==null)
			attributes=new HashMap<String,String>();
		return attributes;
	}
	public void setAttributes(Map<String, String> attributes) {
		this.attributes = attributes;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public List<ActionStepTag> getStepList() {
		return stepList;
	}
	public void setStepList(List<ActionStepTag> stepList) {
		this.stepList = stepList;
	}
	public String getFullTagName(){
		if(StringUtil.isNotBlank(this.namespace))
			return this.namespace+":"+this.tagName;
		else
			return this.tagName;
	}
}
