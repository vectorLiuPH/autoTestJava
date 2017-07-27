package main.framework.xml.model;

/**
 * @author liupengh
 *
 */
public class SqlTag {

		private String SqlScriptContent;
		private String SqlScriptFilePath;
		public String getSqlScriptContent() {
			return SqlScriptContent;
		}
		public void setSqlScriptContent(String sqlScriptContent) {
			SqlScriptContent = sqlScriptContent;
		}
		public String getSqlScriptFilePath() {
			return SqlScriptFilePath;
		}
		public void setSqlScriptFilePath(String sqlScriptFilePath) {
			SqlScriptFilePath = sqlScriptFilePath;
		}
		
}
