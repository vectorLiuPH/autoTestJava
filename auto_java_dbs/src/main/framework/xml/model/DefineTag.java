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
public class DefineTag extends BaseTag {
	
	private List<ElementTag> elementList;
	private List<BeanTag> beanList;
	public List<ElementTag> getElementList() {
		if(elementList==null)
			elementList=new ArrayList<ElementTag>();
		return elementList;
	}
	public void setElementList(List<ElementTag> elementList) {
		this.elementList = elementList;
	}
	public List<BeanTag> getBeanList() {
		if(beanList==null)
			beanList=new ArrayList<BeanTag>();
		return beanList;
	}
	public void setBeanList(List<BeanTag> beanList) {
		this.beanList = beanList;
	}
}	
