using AngularCoreWebApp.Data.Comments;
using AngularCoreWebApp.Data.Items;
using AngularCoreWebApp.Data.Users;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using OpenIddict.Models;

namespace AngularCoreWebApp.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        #region Constructor

        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        #endregion Constructor

        #region Methods

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>().ToTable("Users");
            modelBuilder.Entity<ApplicationUser>().HasMany(u => u.Items).WithOne(i => i.Author);
            modelBuilder.Entity<ApplicationUser>().HasMany(u => u.Comments).WithOne(c => c.Author)
                .HasPrincipalKey(u => u.Id);

            modelBuilder.Entity<Item>().ToTable("Items");
            modelBuilder.Entity<Item>().Property(i => i.Id).ValueGeneratedOnAdd();
            modelBuilder.Entity<Item>().HasOne(i => i.Author).WithMany(u => u.Items);
            modelBuilder.Entity<Item>().HasMany(i => i.Comments).WithOne(c => c.Item);

            modelBuilder.Entity<Comment>().ToTable("Comments");
            modelBuilder.Entity<Comment>().HasOne(c => c.Author).WithMany(u => u.Comments).HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<Comment>().HasOne(c => c.Item).WithMany(i => i.Comments);
            modelBuilder.Entity<Comment>().HasOne(c => c.Parent).WithMany(c => c.Children);
            modelBuilder.Entity<Comment>().HasMany(c => c.Children).WithOne(c => c.Parent);


            modelBuilder.Entity<OpenIddictApplication>().ToTable("OpenIddictApplications");
            //modelBuilder.Entity<OpenIddictApplication>().HasKey(i => i.Id);
            //modelBuilder.Entity<OpenIddictApplication>().Property(i => i.Id).HasMaxLength(450).HasColumnType("nvarchar").ValueGeneratedOnAdd();

            modelBuilder.Entity<OpenIddictAuthorization>().ToTable("OpenIddictAuthorizations");
            //modelBuilder.Entity<OpenIddictAuthorization>().HasKey(i => i.Id);
            //modelBuilder.Entity<OpenIddictAuthorization>().HasOne(q => q.Application).WithMany(q => q.Authorizations).HasForeignKey(q => q.Id);
            //modelBuilder.Entity<OpenIddictAuthorization>().Property(i => i.Id).HasMaxLength(450).HasColumnType("nvarchar").ValueGeneratedOnAdd();

            modelBuilder.Entity<OpenIddictScope>().ToTable("OpenIddictScopes");
            //modelBuilder.Entity<OpenIddictScope>().HasKey(i => i.Id);
            //modelBuilder.Entity<OpenIddictScope>().Property(i => i.Id).HasMaxLength(450).HasColumnType("nvarchar").ValueGeneratedOnAdd();

            modelBuilder.Entity<OpenIddictToken>().ToTable("OpenIddictTokens");
            //modelBuilder.Entity<OpenIddictToken>().HasKey(i => i.Id);
            //modelBuilder.Entity<OpenIddictToken>().Property(i => i.Id).HasMaxLength(450).HasColumnType("nvarchar").ValueGeneratedOnAdd();
            //modelBuilder.Entity<OpenIddictToken>().HasOne(q => q.Application).WithMany(q => q.Tokens).HasForeignKey(q => q.Id);
            //modelBuilder.Entity<OpenIddictToken>().HasOne(q => q.Authorization).WithMany(q => q.Tokens).HasForeignKey(q => q.Id);
        }

        #endregion Methods

        #region Properties

        public DbSet<Item> Items { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<OpenIddictApplication> OpenIddictApplications { get; set; }
        public DbSet<OpenIddictAuthorization> OpenIddictAuthorizations { get; set; }
        public DbSet<OpenIddictScope> OpenIddictScopes { get; set; }
        public DbSet<OpenIddictToken> OpenIddictTokens { get; set; }

        #endregion Properties
    }
}
