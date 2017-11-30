
const TeamAPI = {
  members: [
    { number: 1, name: "Khoi Pham", position: "FE Dev" },
    { number: 2, name: "Long Bui", position: "BE Dev" },
    { number: 3, name: "Huong Nguyen", position: "Tester" },
    { number: 4, name: "Anh Nguyen", position: "Designer" },
    { number: 5, name: "Binh Nguyen", position: "PM" },
  ],
  all: function() { return this.members},
  get: function(id) {
    const member = m => m.number === id
    return this.members.find(member)
  }
}

export default TeamAPI
