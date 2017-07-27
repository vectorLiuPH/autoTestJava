/**
 * 
 */
package main.framework.xml.model;

/**
 * @author liupengh
 *
 */
public class ElementTag extends BaseTag {
	
	private String elementName;
	private String location;
	private Boolean ignoreException=true;
	public String getElementName() {
		return elementName;
	}
	public void setElementName(String elementName) {
		this.elementName = elementName;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public Boolean isIgnoreException() {
		return ignoreException;
	}
	public void setIgnoreException(Boolean ignoreException) {
		this.ignoreException = ignoreException;
	}
}
