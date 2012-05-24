describe("Backbone Factory", function() {

  describe("Defining and using Sequences", function(){

    beforeEach(function() {
      var emailSequence = BackboneFactory.define_sequence('email', function(n){
        return "person"+n+"@example.com"; 
      });
    });

    it("should increment the sequence on successive calls", function(){
      expect(BackboneFactory.next('email')).toBe('person1@example.com');
      expect(BackboneFactory.next('email')).toBe('person2@example.com');
    });

  });

  describe("Defining and using Factories", function(){

    beforeEach(function() {
      var emailSequence = BackboneFactory.define_sequence('person_email', function(n){
        return "person"+n+"@example.com"; 
      });
      var postFactory = BackboneFactory.define('post', Post, function(){
                                          return {
                                            author: BackboneFactory.create('user')
                                          };
                                          }
        );
      var userFactory = BackboneFactory.define('user', User, function(){
                                   return {
                                     name : 'Backbone User',
                                     email: BackboneFactory.next('person_email')
                                      };
                                    }
                                   );

      this.builtUserObject = BackboneFactory.build('user');
      this.builtPostObject = BackboneFactory.build('post');
      this.postObject = BackboneFactory.create('post');
      this.userObject = BackboneFactory.create('user');
    });
    

    it("return an instance of the Backbone Object requested", function() {
      expect(this.postObject instanceof Post).toBeTruthy();
      expect(this.userObject instanceof User).toBeTruthy();
      expect(this.builtUserObject instanceof User).toBeTruthy();
    });
          
    // Not sure if this test is needed. But what the hell!
    it("should preserve the defaults if not overriden", function() {
      expect(this.postObject.get('title')).toBe('Default Title');
      expect(this.builtPostObject.get('title')).toBe('Default Title');
    });

    it("should use the defaults supplied when creating objects", function() {
      expect(this.userObject.get('name')).toBe('Backbone User');
      expect(this.builtUserObject.get('name')).toBe('Backbone User');
    });

    it("should work with sequences", function(){
      expect(this.userObject.get('email')).toBe('person4@example.com');
      var anotherUser = BackboneFactory.create('user');
      expect(anotherUser.get('email')).toBe('person5@example.com');
    });

    it("should work if other factories are passed", function(){
      expect(this.postObject.get('author') instanceof User).toBeTruthy(); 
    })

    it("should override defaults if arguments are passed on creation", function(){
      var userWithEmail = BackboneFactory.create('user', function(){
                                             return {
                                                email: 'overriden@example.com'
                                              };
                            });
      expect(userWithEmail.get('email')).toBe('overriden@example.com');
    });

    it("should override defaults if arguments are passed on build", function(){
      var userWithEmail = BackboneFactory.build('user', function(){
                                             return {
                                                email: 'overriden@example.com'
                                              };
                            });
      expect(userWithEmail.get('email')).toBe('overriden@example.com');
    });

    it("should create with an id", function() {
      expect(this.userObject.id).toBeDefined();
    });

    it("should have an id that increments on creation", function(){
      var firstID = BackboneFactory.create('user').id;
      var secondID = BackboneFactory.create('user').id;
      expect(secondID).toBe(firstID + 1);
    });

    it("should build objects without ids", function(){
      var id = BackboneFactory.build('user').id;
      expect(id).toBeUndefined();
    });

    it("should not increment ids on build", function(){
      var firstID = BackboneFactory.create('user').id;
      var builtId = BackboneFactory.build('user').id;
      var secondID = BackboneFactory.create('user').id;
      expect(secondID).toBe(firstID + 1);
    });
    
    describe("Error Messages", function() {

      it("should throw an error if factory_name is not proper", function() {
        expect(function(){BackboneFactory.define('wrong name', Post)}).toThrow("Factory name should not contain spaces or other funky characters");
      });

      it("should throw an error if you try to use an undefined factory", function() {
        expect(function(){BackboneFactory.create('undefined_factory')}).toThrow("Factory with name undefined_factory does not exist");
      });

      it("should throw an error if you try to use an undefined sequence", function() {
        expect(function(){BackboneFactory.next('undefined_sequence')}).toThrow("Sequence with name undefined_sequence does not exist");
      });
      
    });  
    
  });  
  
});        

