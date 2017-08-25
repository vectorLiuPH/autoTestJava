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
public class ActionTag extends BaseTag {
	
	private List<ActionStepTag> stepList;
	private String name;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<ActionStepTag> getActionStepList() {
		if(stepList==null)
			stepList=new ArrayList<ActionStepTag>();
		return stepList;
	}

	public void setActionStepList(List<ActionStepTag> stepList) {
		this.stepList = stepList;
	}
	
}
