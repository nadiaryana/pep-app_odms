using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Oracle.ManagedDataAccess.Client;

namespace ssc.Areas.PE.Models
{
  public class Production
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId _id { get; set; }
    public DateTime? date { get; set; }
    public decimal? operation { get; set; }
    public decimal? sot { get; set; }
    public decimal? figure { get; set; }
    public decimal? gas { get; set; }
    public decimal? gas_sales { get; set; }
    public decimal? sgt_opr { get; set; }
    public decimal? sbr_opr { get; set; }
    public decimal? bd_opr { get; set; }
    public decimal? sgt_sot { get; set; }
    public decimal? sbr_sot { get; set; }
    public decimal? bd_sot { get; set; }
    public decimal? sgt_fig { get; set; }
    public decimal? sbr_fig { get; set; }
    public decimal? bd_fig { get; set; }
    public decimal? rkap { get; set; }
    public decimal? wpnb { get; set; }
    public string created_by { get; set; }
    public DateTime? created_date { get; set; }
    public string updated_by { get; set; }
    public DateTime? updated_date { get; set; }
    public ProductionError _error { get; set; }
  }

  public class ProductionTmp
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId _id { get; set; }
    public int error_count { get; set; }
    public Production[] items { get; set; }
  }

  public class ProductionError
  {
    public ErrorItem _row { get; set; }
    public ErrorItem date { get; set; }
    public ErrorItem sot { get; set; }
    public ErrorItem operation { get; set; }
    public ErrorItem figure { get; set; }
    public ErrorItem gas { get; set; }
    public ErrorItem gas_sale { get; set; }
    public ErrorItem sgt_opr { get; set; }
    public ErrorItem sbr_opr { get; set; }
    public ErrorItem bd_opr { get; set; }
    public ErrorItem sgt_sot { get; set; }
    public ErrorItem sbr_sot { get; set; }
    public ErrorItem bd_sot { get; set; }
    public ErrorItem sgt_fig { get; set; }
    public ErrorItem sbr_fig { get; set; }
    public ErrorItem bd_fig { get; set; }
    public ErrorItem rkap { get; set; }
    public ErrorItem wpnb { get; set; }
  }

  public class ProductionList
  {
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public Object[] _id { get; set; }
    public Object[] date { get; set; }
    public Object[] operation { get; set; }
    public Object[] sot { get; set; }
    public Object[] figure { get; set; }
    public Object[] gas { get; set; }
    public Object[] gas_sales { get; set; }
    public Object[] sgt_opr { get; set; }
    public Object[] sbr_opr { get; set; }
    public Object[] bd_opr { get; set; }
    // public Object[] borderless_nkl_opr { get; set; }
    // public Object[] borderless_sbj_opr { get; set; }
    public Object[] sgt_sot { get; set; }
    public Object[] sbr_sot { get; set; }
    public Object[] bd_sot { get; set; }
    public Object[] sgt_fig { get; set; }
    public Object[] sbr_fig { get; set; }
    public Object[] bd_fig { get; set; }
    // public Object[] borderless_nkl_sot { get; set; }
    // public Object[] borderless_sbj_sot { get; set; }
    public Object[] rkap { get; set; }
    public Object[] wpnb { get; set; }
  }

  public class ListProduction
  {
    public List<Production> productions { get; set; }
  }

  public static class SOTCommon
  {
    public static OracleConnection conn;
    public static OracleCommand cmd;

    static SOTCommon()
    {
      string connString = "User Id=sot2014pm;Password=tskkm1645pm;Data Source=pepkpdb014.pertamina-ep.net:1521/SOTPROD;";
      conn = new OracleConnection(connString);
      conn.Open();
    }
  }
}
