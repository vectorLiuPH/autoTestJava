package main.framework.common;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;

/**
 * @author liupengh
 *
 */
public class CommonDao {
	
	private JdbcTemplate jdbcTemplate;
	
	public void setDataSource(DataSource dataSource){
		this.jdbcTemplate=new JdbcTemplate(dataSource);
	}

	public List<Map<String,Object>> findMapList(String sql,Object...param){
		return jdbcTemplate.queryForList(sql, param);	
	}
	
	public <T> List<T> find(String sql,RowMapper<T> rowMapper,Object...param){
		return jdbcTemplate.query(sql, rowMapper, param);
	}
	
	public<T>T findUniqueResult(String sql,RowMapper<T> rowMapper,Object...param){
		return jdbcTemplate.queryForObject(sql,rowMapper,param);
	}
	
	public Integer count(String sql,Object...param){
		Object ret=jdbcTemplate.queryForObject(sql,param, Object.class);
		if(ret==null){
			return null;
		}else{
				return new Integer(ret.toString());
		}			
	}
	
	public String findString(String sql,Object...param){
		return jdbcTemplate.queryForObject(sql, param,new RowMapper<String>(){
			public String mapRow(ResultSet rs,int rowNum) throws SQLException{
				return rs.getString(1);
			}
		});
	}
	
	public Map<String,Object> findMap(String sql,Object...param){
		return jdbcTemplate.queryForMap(sql, param);
	}
	
	public int excute(String sql,Object...param){
		return jdbcTemplate.update(sql, param);
	}
	
	public int[] batchExcute(String sql,List<Object[]> param){
		return jdbcTemplate.batchUpdate(sql, param);
	}
	
	public JdbcTemplate getJdbcTmeplate(){
		return jdbcTemplate;
	}
}
