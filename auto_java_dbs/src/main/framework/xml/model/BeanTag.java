/**
 * 
 */
package main.framework.xml.model;

/**
 * @author liupengh
 *
 */
public class BeanTag extends BaseTag {
	
	private String beanName;
	private String ref;
	private String type;
	public String getBeanName() {
		return beanName;
	}
	public void setBeanName(String beanName) {
		this.beanName = beanName;
	}
	public String getRef() {
		return ref;
	}
	public void setRef(String ref) {
		this.ref = ref;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
}
