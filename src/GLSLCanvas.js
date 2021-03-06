import React from 'react';
import GlslCanvas from 'glslCanvas';

class GLSLCanvas extends React.Component { 
  constructor(props) {
    super(props);
    
    this.state = {
      frag: '',
      uniforms: []
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  componentWillReceiveProps(props) {
    // this.init(props);
    this.setState({
      uniforms: props.uniforms
    }, this.updateShaders);
  }

  componentDidMount() {
    this.glslcanvas = new GlslCanvas(this.refs.canvas);

    if(this.props.playOnHover) {
      this.glslcanvas.pause();
      this.refs.canvas.addEventListener('mouseenter', this.handleMouseEnter);
      this.refs.canvas.addEventListener('mouseleave', this.handleMouseLeave);
      this.refs.canvas.addEventListener('mousemove', this.handleMouseMove);
    };

    this.init(this.props);
  }

  componentWillUnmount() {
    this.refs.canvas.removeEventListener('mouseenter', this.handleMouseEnter);
    this.refs.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    this.refs.canvas.removeEventListener('mousemove', this.handleMouseMove);
  }

  init(props) {
    this.glslcanvas.load(this.props.frag);
    this.setState({
      frag: props.frag,
      uniforms: props.uniforms
    }, this.updateShaders);
  }

  handleMouseEnter() {
    this.props.onMouseEnter && this.props.onMouseEnter();
    this.glslcanvas.play();
  }

  handleMouseLeave() {
    this.props.onMouseLeave && this.props.onMouseLeave();
    this.glslcanvas.pause();
  }

  handleMouseMove(e) {
    let x = e.clientX,
      y = e.clientY;

    this.glslcanvas.setMouse({x, y});
  }

  updateShaders() {
    this.state.uniforms.forEach(u => {
      let value = u.value;
      value = Array.isArray(value) ? value : [value];

      this.glslcanvas.setUniform(u.name, ...value);
    }); 
  }
  
  render() {
    let { height, width } = this.props;

    let _props = {
      width: width,
      height: height,
      ref: 'canvas',
      style: { width: width*0.5, height: height*0.5, ...this.props.style }
    };

    return React.createElement('canvas', _props);
  }
}

GLSLCanvas.defaultProps = {
  width: 200,
  height: 200,
  frag: 'void main() {\n gl_FragColor = vec4(0.33, 0.33, 1.0, 1.0);\n }',
  uniforms: [],
  playOnHover: false,
  style: {}
};

// GLSLCanvas.propTypes = {
//   width: React.PropTypes.number,
//   height: React.PropTypes.number,
//   frag: React.PropTypes.string,
//   uniforms: React.PropTypes.array,
//   playOnHover: React.PropTypes.bool,
//   onMouseEnter: React.PropTypes.func,
//   onMouseLeave: React.PropTypes.func
// }

export default GLSLCanvas