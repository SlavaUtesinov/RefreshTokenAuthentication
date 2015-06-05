namespace AngularJSAuthentication.API.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addColumnTheDateTime2RefreshTokens : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.RefreshTokens", "TheDateTime", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.RefreshTokens", "TheDateTime");
        }
    }
}
