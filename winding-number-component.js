/* global AFRAME, THREE */
AFRAME.registerSystem("winding-number", {
  schema: {
    center: {type: "selector"},
    origin: {type: "selector"},
    camera: {type: "selector", default: "#camera"},
    world: {type: "selector"},
    text: {type: "selector"}
  },
  init: function () {
    this.vector2 = new THREE.Vector2();
    this.centerVector2 = new THREE.Vector2();
    this.centerVector3 = new THREE.Vector3()
    this.cameraVector2 = new THREE.Vector2();
    
    this.originVector3 = new THREE.Vector3()
    this.originVector2 = new THREE.Vector2();
    
    this.lastAngle = null
    window.windingNumber = this;
    
    this.level = 0;
  },
  tick: function () {
    this.data.center.object3D.getWorldPosition(this.centerVector3)
    this.centerVector2.set(this.centerVector3.x, this.centerVector3.z)
    
    this.data.origin.object3D.getWorldPosition(this.originVector3)
    this.originVector2.set(this.originVector3.x, this.originVector3.z)
    
    this.cameraVector2.set(this.data.camera.object3D.position.x, this.data.camera.object3D.position.z)
    
    this.vector2.subVectors(this.centerVector2, this.cameraVector2)
    const angle1 = this.vector2.angle()
  
    this.vector2.subVectors(this.centerVector2, this.originVector2)
    const angle2 = this.vector2.angle()
    
    let angle = angle1 - angle2;
    if (angle < 0) {
      angle += 2*Math.PI;
    }
    
    if (this.lastAngle !== null) {
      const angleDifference = angle - this.lastAngle
      if (Math.abs(angleDifference) > 1) {
        console.log(angleDifference)
        if (angleDifference > 0) {
          this.level += 1;
        }
        else {
          this.level -= 1;
        }
        
        this.level = THREE.MathUtils.clamp(this.level, 0, 10)
        this.data.world.object3D.position.y = -this.level * 6;
        this.data.text.setAttribute("value", `Floor ${this.level+1}`)
      }
    }
    this.lastAngle = angle;
  },
});
